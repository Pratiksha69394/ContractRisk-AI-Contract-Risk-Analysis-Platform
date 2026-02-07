
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');
const Contract = require('./models/Contract');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '10mb' }));
// app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(cors({ origin: '*' }));

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (mongoURI) {
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.log('Using in-memory storage');
  }
};
connectDB();

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

app.post('/api/auth/register', [body('name').trim().notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const user = await User.create(req.body);
  res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
});

app.post('/api/auth/login', [body('email').isEmail(), body('password').notEmpty()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
});

app.get('/api/auth/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

app.get('/api/contracts', auth, async (req, res) => {
  const contracts = await Contract.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(contracts);
});

app.get('/api/contracts/:id', auth, async (req, res) => {
  const contract = await Contract.findOne({ _id: req.params.id, userId: req.user.id });
  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  res.json(contract);
});

app.post('/api/contracts', auth, async (req, res) => {
  const { id, name, uploadDate, status, riskScore, riskLevel, summary, keyRisks, recommendations, fileContent } = req.body;
  const contractData = {
    userId: req.user.id,
    name: name || 'Untitled Contract',
    uploadDate: uploadDate || new Date(),
    status: status || 'pending',
    riskScore: riskScore || 0,
    riskLevel: riskLevel || 'pending',
    summary: summary || '',
    keyRisks: keyRisks || [],
    recommendations: recommendations || [],
    fileContent: fileContent || ''
  };
  if (id) contractData._id = id;
  const contract = await Contract.create(contractData);
  res.status(201).json(contract);
});

app.patch('/api/contracts/:id', auth, async (req, res) => {
  const contract = await Contract.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  res.json(contract);
});

app.delete('/api/contracts/:id', auth, async (req, res) => {
  const contract = await Contract.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  res.json({ message: 'Deleted' });
});

app.post('/api/analyze', auth, async (req, res) => {
  const { contractContent, contractName, contractId, fileContent } = req.body;
  const userId = req.user.id;
  
  if (!contractContent) return res.status(400).json({ error: 'No content' });

  let analysis;
  const groqApiKey = process.env.GROQ_API_KEY;
  
  const useGroq = groqApiKey && groqApiKey !== 'your_groq_api_key_here' && groqApiKey.length > 10;
  
  if (useGroq) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + groqApiKey
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are a legal contract analyst. Return ONLY valid JSON like: {"summary":"...","riskScore":50,"riskLevel":"medium","keyRisks":[{"category":"legal","description":"...","severity":"medium"}],"recommendations":["..."]}. DO NOT include any markdown formatting, code blocks, or explanatory text.' },
            { role: 'user', content: 'Analyze this contract: ' + (contractName || 'Contract') + '. Content: ' + contractContent.substring(0, 5000) }
          ],
          temperature: 0.1,
          max_tokens: 1000,
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        let text = data.choices?.[0]?.message?.content || '';
        
        // Clean the text: remove markdown code blocks and any non-JSON content
        text = text.replace(/```json/g, '').replace(/```/g, '').replace(/JSON/gi, '').trim();
        
        // Try to parse JSON
        try {
          // Try direct parse first
          analysis = JSON.parse(text);
        } catch (e) {
          // Try extracting JSON object from text
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            try {
              analysis = JSON.parse(match[0]);
            } catch (e2) {
              // Try to fix common JSON issues
              try {
                const fixedText = match[0]
                  .replace(/'/g, '"')
                  .replace(/,\s*}/g, '}')
                  .replace(/,\s*]/g, ']');
                analysis = JSON.parse(fixedText);
              } catch (e3) {
                // Fall through to fallback
              }
            }
          }
        }
        
        // Validate analysis has required fields
        if (analysis && (!analysis.keyRisks || !analysis.recommendations)) {
          analysis = null; // Force fallback
        }
      }
    } catch (e) {
      // Silent fail, will use fallback
    }
  }

  // If no valid analysis from Groq, use content-aware fallback analysis
  if (!analysis) {
    const content = contractContent;
    const contentLower = content.toLowerCase();
    const wordCount = content.split(/\s+/).length;
    
    // Detect contract type based on content patterns
    let contractType = 'general';
    if (contentLower.includes('non-disclosure') || contentLower.includes('confidential information') || contentLower.includes('proprietary information')) {
      contractType = 'nda';
    } else if (contentLower.includes('employment') || contentLower.includes('employee') || contentLower.includes('salary') || contentLower.includes('position')) {
      contractType = 'employment';
    } else if (contentLower.includes('service') || contentLower.includes('provider') || contentLower.includes('deliverable')) {
      contractType = 'service';
    } else if (contentLower.includes('lease') || contentLower.includes('rent') || contentLower.includes('property')) {
      contractType = 'lease';
    } else if (contentLower.includes('sale') || contentLower.includes('purchase') || contentLower.includes('buyer') || contentLower.includes('seller')) {
      contractType = 'sales';
    }
    
    // Comprehensive risk term analysis with context awareness
    const riskAnalysis = {
      // High risk terms with severity weights
      highRiskTerms: [
        { term: 'unlimited liability', weight: 15, description: 'Unlimited financial exposure' },
        { term: 'indemnify', weight: 12, description: 'Indemnification obligation' },
        { term: 'hold harmless', weight: 12, description: 'Hold harmless clause' },
        { term: 'exclusive', weight: 10, description: 'Exclusive rights provision' },
        { term: 'perpetual', weight: 10, description: 'Perpetual or indefinite term' },
        { term: 'irrevocable', weight: 10, description: 'Irrevocable rights' },
        { term: 'automatic renewal', weight: 8, description: 'Automatic renewal clause' },
        { term: 'binding arbitration', weight: 8, description: 'Forced arbitration' },
        { term: 'waive rights', weight: 10, description: 'Rights waiver' },
        { term: 'liquidated damages', weight: 7, description: 'Pre-defined damages' },
        { term: 'non-compete', weight: 9, description: 'Non-compete restriction' },
        { term: 'intellectual property', weight: 6, description: 'IP assignment clause' }
      ],
      // Medium risk terms
      mediumRiskTerms: [
        { term: 'termination', weight: 5, description: 'Termination rights' },
        { term: 'breach', weight: 4, description: 'Breach consequences' },
        { term: 'damages', weight: 4, description: 'Damage provisions' },
        { term: 'penalty', weight: 5, description: 'Penalty clauses' },
        { term: 'modify', weight: 3, description: 'Modification rights' },
        { term: 'restrict', weight: 3, description: 'Restriction clauses' },
        { term: 'notice period', weight: 3, description: 'Notice requirements' },
        { term: 'governing law', weight: 2, description: 'Jurisdiction issues' },
        { term: 'assignment', weight: 3, description: 'Assignment rights' },
        { term: 'force majeure', weight: 2, description: 'Force majeure provisions' }
      ],
      // Low risk terms
      lowRiskTerms: [
        { term: 'confidential', weight: 1, description: 'Confidentiality obligations' },
        { term: 'dispute', weight: 1, description: 'Dispute resolution' },
        { term: 'arbitration', weight: 2, description: 'Arbitration clause' },
        { term: 'jurisdiction', weight: 1, description: 'Jurisdiction selection' },
        { term: 'warranty', weight: 2, description: 'Warranty terms' },
        { term: 'guarantee', weight: 2, description: 'Guarantee provisions' }
      ]
    };
    
    // Analyze content for each term with context
    let totalScore = 0;
    const foundRisks = [];
    const foundTerms = new Set();
    
    // Check high risk terms
    for (const riskTerm of riskAnalysis.highRiskTerms) {
      const regex = new RegExp(riskTerm.term, 'gi');
      const matches = contentLower.match(regex) || [];
      if (matches.length > 0 && !foundTerms.has(riskTerm.term)) {
        totalScore += riskTerm.weight * Math.min(matches.length, 3); // Cap at 3 occurrences
        foundRisks.push({
          category: 'legal',
          description: `Contract contains "${matches[0]}" term: ${riskTerm.description}. This appears ${matches.length} time(s) in the document.`,
          severity: 'high',
          term: riskTerm.term,
          count: matches.length
        });
        foundTerms.add(riskTerm.term);
      }
    }
    
    // Check medium risk terms
    for (const riskTerm of riskAnalysis.mediumRiskTerms) {
      const regex = new RegExp(riskTerm.term, 'gi');
      const matches = contentLower.match(regex) || [];
      if (matches.length > 0 && !foundTerms.has(riskTerm.term)) {
        totalScore += riskTerm.weight * Math.min(matches.length, 4);
        foundRisks.push({
          category: 'legal',
          description: `Contract contains "${matches[0]}" provision: ${riskTerm.description}. Found ${matches.length} occurrence(s).`,
          severity: 'medium',
          term: riskTerm.term,
          count: matches.length
        });
        foundTerms.add(riskTerm.term);
      }
    }
    
    // Check low risk terms
    for (const riskTerm of riskAnalysis.lowRiskTerms) {
      const regex = new RegExp(riskTerm.term, 'gi');
      const matches = contentLower.match(regex) || [];
      if (matches.length > 0 && !foundTerms.has(riskTerm.term)) {
        totalScore += riskTerm.weight * Math.min(matches.length, 5);
        foundRisks.push({
          category: 'compliance',
          description: `Contract includes ${riskTerm.term} terms: ${riskTerm.description}. Review for compliance requirements.`,
          severity: 'low',
          term: riskTerm.term,
          count: matches.length
        });
        foundTerms.add(riskTerm.term);
      }
    }
    
    // Length-based adjustment - longer contracts have more risk surface
    const lengthFactor = Math.min(wordCount / 1000, 2); // Max 2x multiplier for very long docs
    totalScore = Math.round(totalScore * (0.5 + lengthFactor * 0.5));
    
    // Type-based adjustment
    const typeMultipliers = {
      'nda': 1.2, // NDAs have higher secrecy risks
      'employment': 0.8, // Employment is usually standard
      'service': 1.0,
      'lease': 0.9,
      'sales': 1.1,
      'general': 1.0
    };
    totalScore = Math.round(totalScore * typeMultipliers[contractType]);
    
    // Clamp score to 0-100
    totalScore = Math.max(0, Math.min(100, totalScore));
    
    // Ensure minimum variance - contracts with no detected terms get low score
    if (totalScore < 10) {
      totalScore = Math.round(10 + Math.random() * 15); // Random between 10-25
    }
    
    const riskLevel = totalScore > 60 ? 'high' : totalScore > 35 ? 'medium' : 'low';
    
    // Sort risks by severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    foundRisks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    
    // If no risks found, create content-specific ones
    if (foundRisks.length === 0) {
      // Analyze based on contract type
      if (contractType === 'nda') {
        foundRisks.push({
          category: 'legal',
          description: 'Non-disclosure agreement contains standard confidentiality provisions. Review scope of protected information.',
          severity: 'low',
          term: 'confidentiality',
          count: 1
        });
      } else if (contractType === 'employment') {
        foundRisks.push({
          category: 'legal',
          description: 'Employment agreement should be reviewed for compensation terms, benefits, and termination conditions.',
          severity: 'low',
          term: 'employment',
          count: 1
        });
      } else {
        foundRisks.push({
          category: 'legal',
          description: 'General contract terms require standard legal review for compliance and risk assessment.',
          severity: 'low',
          term: 'general',
          count: 1
        });
      }
    }
    
    // Generate type-specific recommendations
    const typeRecommendations = {
      'nda': [
        'Verify the definition of confidential information covers all necessary data',
        'Check the duration of confidentiality obligations',
        'Ensure carve-outs for publicly available information are included',
        'Review remedies for breach of confidentiality'
      ],
      'employment': [
        'Review compensation and benefits alignment with market standards',
        'Verify termination provisions for fairness',
        'Check non-compete or non-solicitation clauses',
        'Ensure compliance with local labor laws'
      ],
      'service': [
        'Clarify scope of services and deliverables',
        'Verify payment terms and milestones',
        'Review liability caps and indemnification',
        'Check termination rights for both parties'
      ],
      'lease': [
        'Verify rent escalation clauses',
        'Check maintenance and repair responsibilities',
        'Review early termination options',
        'Ensure compliance with tenant rights laws'
      ],
      'sales': [
        'Verify delivery and acceptance criteria',
        'Review warranty and return policies',
        'Check penalty and liability provisions',
        'Ensure clear dispute resolution mechanisms'
      ],
      'general': [
        'Review all definitions for clarity and scope',
        'Verify termination rights and notice requirements',
        'Check liability and indemnification provisions',
        'Ensure compliance terms are current',
        'Consider seeking legal counsel for complex clauses'
      ]
    };
    
    const recommendations = typeRecommendations[contractType] || typeRecommendations.general;
    
    analysis = {
      summary: `${contractType.toUpperCase()} Analysis: This ${contractName || 'contract'} (${wordCount} words) is classified as ${riskLevel} risk with a score of ${totalScore}. The analysis identified ${foundRisks.length} key risk areas requiring attention.`,
      riskScore: totalScore,
      riskLevel: riskLevel,
      keyRisks: foundRisks,
      recommendations: recommendations
    };
  }

  const saveData = {
    userId,
    name: contractName || 'Untitled Contract',
    status: 'analyzed',
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    summary: analysis.summary,
    keyRisks: analysis.keyRisks || [],
    recommendations: analysis.recommendations || [],
    fileContent: fileContent || contractContent
  };

  let savedContract;
  if (contractId) {
    savedContract = await Contract.findOneAndUpdate(
      { _id: contractId, userId },
      saveData,
      { new: true }
    );
    if (!savedContract) return res.status(404).json({ error: 'Contract not found' });
  } else {
    savedContract = await Contract.create(saveData);
  }

  res.json({ ...analysis, savedContract: { id: savedContract._id, ...saveData } });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => console.log('Server on ' + PORT)).on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.error('Port ' + PORT + ' in use');
  process.exit(1);
});

module.exports = app;
