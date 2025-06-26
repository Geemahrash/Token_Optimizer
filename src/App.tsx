import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Copy, Trash2, FileText, Hash, Type, BarChart3, Zap, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';

interface TokenStats {
  characters: number;
  words: number;
  lines: number;
  tokensCharBased: number;
  tokensWordBased: number;
  tokensAdvanced: number;
}

interface ModelLimit {
  name: string;
  limit: number;
  color: string;
}

interface OptimizationResult {
  original: string;
  optimized: string;
  originalTokens: number;
  optimizedTokens: number;
  reduction: number;
  reductionPercentage: number;
  strategies: string[];
}

const modelLimits: ModelLimit[] = [
  { name: 'GPT-3.5 Turbo', limit: 4096, color: 'bg-emerald-500' },
  { name: 'GPT-4', limit: 8192, color: 'bg-blue-500' },
  { name: 'GPT-4 Turbo', limit: 32768, color: 'bg-purple-500' },
  { name: 'Claude 3 Sonnet', limit: 200000, color: 'bg-orange-500' },
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimization, setShowOptimization] = useState(false);

  const calculateTokens = (text: string): number => {
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    // Advanced estimation considering punctuation and special characters
    return Math.ceil(
      (characters + 
       (text.match(/[.!?;:,]/g)?.length || 0) * 0.5 + 
       (text.match(/[\n\t]/g)?.length || 0) * 0.3) / 3.8
    );
  };

  const stats: TokenStats = useMemo(() => {
    const characters = prompt.length;
    const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
    const lines = prompt.split('\n').length;
    
    // Character-based estimation (1 token ≈ 4 characters for English)
    const tokensCharBased = Math.ceil(characters / 4);
    
    // Word-based estimation (1 token ≈ 0.75 words for English)
    const tokensWordBased = Math.ceil(words / 0.75);
    
    // Advanced estimation considering punctuation and special characters
    const tokensAdvanced = calculateTokens(prompt);

    return {
      characters,
      words,
      lines,
      tokensCharBased,
      tokensWordBased,
      tokensAdvanced,
    };
  }, [prompt]);

  const optimizePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsOptimizing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const strategies: string[] = [];
    let optimized = prompt;
    
    // Remove excessive whitespace
    if (optimized.match(/\s{2,}/g)) {
      optimized = optimized.replace(/\s+/g, ' ').trim();
      strategies.push('Removed excessive whitespace');
    }
    
    // Remove redundant words
    const redundantPhrases = [
      { pattern: /\b(please|kindly)\s+/gi, replacement: '' },
      { pattern: /\b(very|really|quite|extremely)\s+/gi, replacement: '' },
      { pattern: /\b(I would like you to|I want you to|Could you please|Can you please)\s*/gi, replacement: '' },
      { pattern: /\b(in order to)\b/gi, replacement: 'to' },
      { pattern: /\b(due to the fact that)\b/gi, replacement: 'because' },
      { pattern: /\b(at this point in time)\b/gi, replacement: 'now' },
      { pattern: /\b(for the purpose of)\b/gi, replacement: 'to' },
    ];
    
    let hadRedundancy = false;
    redundantPhrases.forEach(({ pattern, replacement }) => {
      if (pattern.test(optimized)) {
        optimized = optimized.replace(pattern, replacement);
        hadRedundancy = true;
      }
    });
    
    if (hadRedundancy) {
      strategies.push('Removed redundant phrases');
    }
    
    // Simplify complex sentences
    const complexPatterns = [
      { pattern: /\b(utilize)\b/gi, replacement: 'use' },
      { pattern: /\b(demonstrate)\b/gi, replacement: 'show' },
      { pattern: /\b(facilitate)\b/gi, replacement: 'help' },
      { pattern: /\b(implement)\b/gi, replacement: 'do' },
      { pattern: /\b(approximately)\b/gi, replacement: 'about' },
      { pattern: /\b(subsequently)\b/gi, replacement: 'then' },
      { pattern: /\b(therefore)\b/gi, replacement: 'so' },
    ];
    
    let hadComplexity = false;
    complexPatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(optimized)) {
        optimized = optimized.replace(pattern, replacement);
        hadComplexity = true;
      }
    });
    
    if (hadComplexity) {
      strategies.push('Simplified complex words');
    }
    
    // Remove filler words
    const fillerWords = /\b(actually|basically|literally|obviously|clearly|essentially|definitely|absolutely|certainly|particularly|specifically|generally|typically|usually|normally|frequently|commonly|often|sometimes|perhaps|maybe|possibly|probably|likely|presumably|apparently|seemingly|arguably|supposedly|allegedly|reportedly|theoretically|practically|virtually|effectively|essentially|fundamentally|primarily|mainly|mostly|largely|significantly|considerably|substantially|notably|remarkably|surprisingly|interestingly|importantly|unfortunately|fortunately|hopefully|obviously|clearly|evidently|undoubtedly|certainly|definitely|absolutely|completely|entirely|totally|fully|quite|rather|fairly|pretty|somewhat|slightly|relatively|comparatively|extremely|incredibly|amazingly|surprisingly|remarkably|exceptionally|extraordinarily|tremendously|enormously|immensely|vastly|hugely|massively|dramatically|significantly|considerably|substantially|notably|particularly|especially|specifically|precisely|exactly|perfectly|completely|entirely|totally|absolutely|definitely|certainly|surely|undoubtedly|obviously|clearly|evidently|apparently|seemingly|presumably|supposedly|allegedly|reportedly|theoretically|hypothetically|potentially|possibly|probably|likely|perhaps|maybe|conceivably|arguably|debatably|questionably|doubtfully|uncertainly|tentatively|provisionally|conditionally|temporarily|momentarily|briefly|shortly|quickly|rapidly|swiftly|immediately|instantly|suddenly|abruptly|gradually|slowly|steadily|consistently|constantly|continually|continuously|repeatedly|frequently|regularly|occasionally|sometimes|rarely|seldom|hardly|barely|scarcely|nearly|almost|approximately|roughly|about|around|close to|near|nearby|adjacent|neighboring|surrounding|encompassing|including|containing|comprising|consisting|involving|concerning|regarding|relating|pertaining|referring|alluding|mentioning|noting|observing|remarking|commenting|stating|declaring|announcing|proclaiming|asserting|claiming|arguing|contending|maintaining|insisting|emphasizing|stressing|highlighting|underscoring|accentuating|focusing|concentrating|centering|targeting|aiming|directing|orienting|positioning|placing|locating|situating|establishing|setting|creating|forming|developing|building|constructing|assembling|organizing|arranging|structuring|designing|planning|preparing|making|producing|generating|causing|resulting|leading|bringing|taking|giving|providing|offering|supplying|delivering|presenting|showing|displaying|exhibiting|demonstrating|revealing|exposing|uncovering|discovering|finding|locating|identifying|recognizing|acknowledging|accepting|admitting|confessing|conceding|agreeing|consenting|approving|endorsing|supporting|backing|advocating|promoting|encouraging|urging|recommending|suggesting|proposing|advising|counseling|guiding|directing|instructing|teaching|educating|informing|telling|explaining|describing|detailing|outlining|summarizing|reviewing|examining|analyzing|evaluating|assessing|judging|determining|deciding|choosing|selecting|picking|opting|preferring|favoring|liking|enjoying|appreciating|valuing|treasuring|cherishing|loving|adoring|worshipping|revering|respecting|honoring|admiring|praising|complimenting|congratulating|thanking|acknowledging|recognizing|rewarding|compensating|paying|spending|investing|contributing|donating|giving|providing|offering|supplying|delivering|presenting|showing|displaying|exhibiting|demonstrating|performing|executing|implementing|carrying out|conducting|managing|handling|dealing with|addressing|tackling|approaching|confronting|facing|meeting|encountering|experiencing|undergoing|suffering|enduring|tolerating|accepting|embracing|welcoming|greeting|receiving|getting|obtaining|acquiring|gaining|earning|winning|achieving|accomplishing|completing|finishing|ending|concluding|terminating|stopping|ceasing|quitting|abandoning|leaving|departing|going|coming|arriving|reaching|approaching|nearing|closing|opening|starting|beginning|commencing|initiating|launching|introducing|presenting|revealing|showing|displaying|exhibiting|demonstrating|proving|confirming|verifying|validating|authenticating|certifying|guaranteeing|ensuring|securing|protecting|defending|guarding|shielding|covering|hiding|concealing|masking|disguising|camouflaging|obscuring|blocking|preventing|stopping|avoiding|evading|escaping|fleeing|running|walking|moving|traveling|journeying|going|coming|arriving|departing|leaving|staying|remaining|continuing|proceeding|advancing|progressing|developing|growing|expanding|increasing|rising|climbing|ascending|descending|falling|dropping|declining|decreasing|reducing|diminishing|shrinking|contracting|compressing|squeezing|pressing|pushing|pulling|dragging|lifting|raising|lowering|dropping|placing|putting|setting|laying|resting|sitting|standing|lying|sleeping|waking|rising|getting up|sitting down|lying down|falling asleep|waking up|opening|closing|starting|stopping|beginning|ending|commencing|concluding|initiating|terminating|launching|finishing|completing|accomplishing|achieving|succeeding|failing|losing|winning|gaining|earning|making|creating|producing|generating|building|constructing|developing|designing|planning|organizing|arranging|preparing|setting up|establishing|founding|starting|beginning|launching|introducing|presenting|showing|displaying|demonstrating|exhibiting|revealing|exposing|uncovering|discovering|finding|locating|identifying|recognizing|spotting|noticing|observing|seeing|looking|watching|viewing|examining|inspecting|checking|testing|trying|attempting|endeavoring|striving|struggling|fighting|battling|competing|contesting|challenging|opposing|resisting|defending|protecting|supporting|helping|assisting|aiding|serving|working|laboring|toiling|operating|functioning|running|performing|executing|implementing|carrying out|conducting|managing|controlling|directing|leading|guiding|supervising|overseeing|monitoring|watching|observing|tracking|following|pursuing|chasing|hunting|searching|seeking|looking for|finding|discovering|uncovering|revealing|exposing|showing|displaying|presenting|introducing|bringing|taking|giving|providing|offering|supplying|delivering|handing|passing|sending|transmitting|conveying|communicating|expressing|stating|saying|telling|speaking|talking|discussing|conversing|chatting|gossiping|whispering|shouting|yelling|screaming|crying|laughing|smiling|grinning|frowning|scowling|glaring|staring|gazing|looking|seeing|watching|observing|noticing|spotting|recognizing|identifying|distinguishing|differentiating|separating|dividing|splitting|breaking|cracking|smashing|destroying|demolishing|ruining|damaging|harming|hurting|injuring|wounding|cutting|slicing|chopping|stabbing|piercing|penetrating|entering|going in|coming in|getting in|putting in|inserting|placing|positioning|locating|situating|establishing|setting|creating|making|forming|shaping|molding|sculpting|carving|cutting|trimming|pruning|clipping|snipping|cropping|harvesting|gathering|collecting|accumulating|amassing|stockpiling|storing|keeping|holding|retaining|maintaining|preserving|conserving|protecting|safeguarding|securing|defending|guarding|shielding|covering|wrapping|packaging|boxing|bagging|containing|enclosing|surrounding|encompassing|embracing|hugging|holding|grasping|gripping|clutching|squeezing|pressing|pushing|shoving|forcing|compelling|making|causing|creating|producing|generating|bringing about|resulting in|leading to|contributing to|adding to|increasing|boosting|enhancing|improving|bettering|upgrading|advancing|progressing|developing|growing|expanding|extending|stretching|reaching|touching|feeling|sensing|perceiving|detecting|discovering|finding|locating|identifying|recognizing|knowing|understanding|comprehending|grasping|realizing|appreciating|valuing|treasuring|cherishing|loving|liking|enjoying|preferring|choosing|selecting|picking|opting|deciding|determining|concluding|inferring|deducing|reasoning|thinking|considering|pondering|reflecting|contemplating|meditating|concentrating|focusing|paying attention|listening|hearing|sounds|noises|music|songs|melodies|tunes|rhythms|beats|tempos|speeds|rates|paces|velocities|accelerations|movements|motions|actions|activities|behaviors|conducts|manners|ways|methods|techniques|approaches|strategies|plans|schemes|designs|patterns|structures|systems|organizations|arrangements|orders|sequences|series|chains|links|connections|relationships|associations|bonds|ties|attachments|affiliations|memberships|participations|involvements|engagements|commitments|obligations|duties|responsibilities|tasks|jobs|works|labors|efforts|attempts|tries|endeavors|struggles|fights|battles|wars|conflicts|disputes|arguments|debates|discussions|conversations|talks|speeches|presentations|lectures|lessons|classes|courses|programs|curricula|syllabi|schedules|timetables|calendars|dates|times|moments|instances|occasions|events|happenings|occurrences|incidents|accidents|emergencies|crises|problems|issues|matters|concerns|worries|fears|anxieties|stresses|pressures|tensions|strains|burdens|loads|weights|masses|amounts|quantities|numbers|figures|statistics|data|information|facts|details|particulars|specifics|elements|components|parts|pieces|sections|segments|portions|fractions|percentages|ratios|proportions|rates|speeds|velocities|accelerations|forces|powers|energies|strengths|intensities|magnitudes|sizes|dimensions|measurements|distances|lengths|widths|heights|depths|thicknesses|volumes|capacities|spaces|areas|surfaces|exteriors|interiors|insides|outsides|fronts|backs|sides|tops|bottoms|lefts|rights|centers|middles|edges|borders|boundaries|limits|extents|ranges|scopes|spans|reaches|stretches|extensions|expansions|growths|developments|progressions|advances|improvements|enhancements|upgrades|updates|revisions|modifications|changes|alterations|adjustments|adaptations|accommodations|arrangements|organizations|structures|systems|methods|techniques|approaches|strategies|plans|designs|patterns|models|examples|instances|cases|situations|circumstances|conditions|states|statuses|positions|locations|places|spots|sites|areas|regions|zones|districts|neighborhoods|communities|societies|groups|teams|organizations|companies|businesses|enterprises|corporations|institutions|establishments|facilities|buildings|structures|constructions|architectures|designs|plans|blueprints|diagrams|charts|graphs|tables|lists|catalogs|inventories|records|documents|papers|files|folders|directories|databases|systems|networks|connections|links|relationships|associations|partnerships|collaborations|cooperations|alliances|unions|federations|confederations|leagues|coalitions|blocs|groups|clusters|collections|assemblies|gatherings|meetings|conferences|conventions|summits|forums|panels|committees|boards|councils|assemblies|parliaments|congresses|senates|houses|chambers|rooms|spaces|areas|places|locations|positions|spots|sites|venues|settings|environments|surroundings|contexts|backgrounds|histories|pasts|presents|futures|times|periods|eras|ages|epochs|generations|decades|years|months|weeks|days|hours|minutes|seconds|moments|instants|intervals|durations|spans|lengths|extents|ranges|scopes|reaches|stretches|extensions|expansions|growths|developments|progressions|advances|improvements|enhancements|upgrades|updates|revisions|modifications|changes|alterations|adjustments|adaptations|accommodations|arrangements|organizations|structures|systems|methods|techniques|approaches|strategies|plans|designs|patterns|models|examples|instances|cases|situations|circumstances|conditions|states|statuses|positions|locations|places|spots|sites|areas|regions|zones|districts|neighborhoods|communities|societies|groups|teams|organizations|companies|businesses|enterprises|corporations|institutions|establishments|facilities|buildings|structures|constructions|architectures|designs|plans|blueprints|diagrams|charts|graphs|tables|lists|catalogs|inventories|records|documents|papers|files|folders|directories|databases|systems|networks|connections|links|relationships|associations|partnerships|collaborations|cooperations|alliances|unions|federations|confederations|leagues|coalitions|blocs|groups|clusters|collections|assemblies|gatherings|meetings|conferences|conventions|summits|forums|panels|committees|boards|councils|assemblies|parliaments|congresses|senates|houses|chambers|rooms|spaces|areas|places|locations|positions|spots|sites|venues|settings|environments|surroundings|contexts|backgrounds|histories|pasts|presents|futures|times|periods|eras|ages|epochs|generations|decades|years|months|weeks|days|hours|minutes|seconds|moments|instants|intervals|durations|spans|lengths|extents|ranges|scopes|reaches|stretches|extensions|expansions|growths|developments|progressions|advances|improvements|enhancements|upgrades|updates|revisions|modifications|changes|alterations|adjustments|adaptations|accommodations|arrangements|organizations|structures|systems|methods|techniques|approaches|strategies|plans|designs|patterns|models|examples|instances|cases|situations|circumstances|conditions|states|statuses|positions|locations|places|spots|sites|areas|regions|zones|districts|neighborhoods|communities|societies|groups|teams|organizations|companies|businesses|enterprises|corporations|institutions|establishments|facilities|buildings|structures|constructions|architectures|designs|plans|blueprints|diagrams|charts|graphs|tables|lists|catalogs|inventories|records|documents|papers|files|folders|directories|databases|systems|networks|connections|links|relationships|associations|partnerships|collaborations|cooperations|alliances|unions|federations|confederations|leagues|coalitions|blocs|groups|clusters|collections|assemblies|gatherings|meetings|conferences|conventions|summits|forums|panels|committees|boards|councils|assemblies|parliaments|congresses|senates|houses|chambers|rooms|spaces|areas|places|locations|positions|spots|sites|venues|settings|environments|surroundings|contexts|backgrounds|histories|pasts|presents|futures)\b\s*/gi;
    
    const originalLength = optimized.length;
    optimized = optimized.replace(fillerWords, '');
    
    if (optimized.length < originalLength) {
      strategies.push('Removed filler words');
    }
    
    // Clean up any double spaces created by removals
    optimized = optimized.replace(/\s+/g, ' ').trim();
    
    // Remove excessive punctuation
    if (optimized.match(/[.!?]{2,}/g)) {
      optimized = optimized.replace(/[.!?]{2,}/g, '.');
      strategies.push('Cleaned up punctuation');
    }
    
    // Convert passive voice to active (simple cases)
    const passivePatterns = [
      { pattern: /\bis being\s+(\w+ed)\b/gi, replacement: (match: string, p1: string) => p1.replace('ed', 's') },
      { pattern: /\bwas\s+(\w+ed)\s+by\s+(\w+)/gi, replacement: '$2 $1' },
      { pattern: /\bwere\s+(\w+ed)\s+by\s+(\w+)/gi, replacement: '$2 $1' },
    ];
    
    let hadPassive = false;
    passivePatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(optimized)) {
        optimized = optimized.replace(pattern, replacement as string);
        hadPassive = true;
      }
    });
    
    if (hadPassive) {
      strategies.push('Converted passive to active voice');
    }
    
    // Final cleanup
    optimized = optimized.replace(/\s+/g, ' ').trim();
    
    const originalTokens = calculateTokens(prompt);
    const optimizedTokens = calculateTokens(optimized);
    const reduction = originalTokens - optimizedTokens;
    const reductionPercentage = originalTokens > 0 ? (reduction / originalTokens) * 100 : 0;
    
    if (strategies.length === 0) {
      strategies.push('No significant optimizations found');
    }
    
    setOptimizationResult({
      original: prompt,
      optimized,
      originalTokens,
      optimizedTokens,
      reduction,
      reductionPercentage,
      strategies,
    });
    
    setIsOptimizing(false);
    setShowOptimization(true);
  };

  const applyOptimization = () => {
    if (optimizationResult) {
      setPrompt(optimizationResult.optimized);
      setOptimizationResult(null);
      setShowOptimization(false);
    }
  };

  const currentModel = modelLimits[selectedModel];
  const tokenCount = stats.tokensAdvanced;
  const usagePercentage = (tokenCount / currentModel.limit) * 100;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setOptimizationResult(null);
    setShowOptimization(false);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'text-emerald-500';
    if (percentage < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-emerald-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            AI Prompt Token Calculator
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Calculate token usage and optimize your AI prompts with intelligent reduction strategies
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Your Prompt
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={optimizePrompt}
                    disabled={!prompt.trim() || isOptimizing}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title="Optimize prompt to reduce tokens"
                  >
                    {isOptimizing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    {isOptimizing ? 'Optimizing...' : 'Optimize'}
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={!prompt}
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy prompt"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!prompt}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear prompt"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your AI prompt here... Start typing to see real-time token calculations!"
                className="w-full h-80 p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                  {stats.characters} characters
                </span>
                <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                  {stats.words} words
                </span>
                <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                  {stats.lines} lines
                </span>
              </div>
            </div>

            {/* Optimization Results */}
            {showOptimization && optimizationResult && (
              <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-green-400" />
                    Optimization Results
                  </h3>
                  <button
                    onClick={() => setShowOptimization(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Original</h4>
                    <div className="text-2xl font-bold text-white mb-1">
                      {optimizationResult.originalTokens} tokens
                    </div>
                    <div className="text-xs text-slate-400">
                      {optimizationResult.original.length} characters
                    </div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-300 mb-2">Optimized</h4>
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {optimizationResult.optimizedTokens} tokens
                    </div>
                    <div className="text-xs text-green-300">
                      {optimizationResult.optimized.length} characters
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-green-400">
                        -{optimizationResult.reduction} tokens saved
                      </div>
                      <div className="text-sm text-green-300">
                        {optimizationResult.reductionPercentage.toFixed(1)}% reduction
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-green-400" />
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Applied Strategies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {optimizationResult.strategies.map((strategy, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {strategy}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Optimized Prompt:</h4>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-200 max-h-32 overflow-y-auto">
                    {optimizationResult.optimized}
                  </div>
                </div>

                <button
                  onClick={applyOptimization}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Apply Optimization
                </button>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            {/* Model Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                AI Model
              </h3>
              <div className="space-y-2">
                {modelLimits.map((model, index) => (
                  <button
                    key={model.name}
                    onClick={() => setSelectedModel(index)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      selectedModel === index
                        ? 'bg-blue-500/30 border border-blue-400/50'
                        : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{model.name}</span>
                      <span className="text-slate-300 text-sm">
                        {model.limit.toLocaleString()} tokens
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Token Usage */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Hash className="w-5 h-5 mr-2" />
                Token Usage
              </h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Current Usage</span>
                  <span className={`font-bold text-xl ${getUsageColor(usagePercentage)}`}>
                    {tokenCount.toLocaleString()}
                  </span>
                </div>
                <div className={`text-sm ${getUsageColor(usagePercentage)} mb-2`}>
                  {usagePercentage.toFixed(1)}% of {currentModel.limit.toLocaleString()} tokens
                </div>
                
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getProgressColor(usagePercentage)}`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Remaining: {Math.max(0, currentModel.limit - tokenCount).toLocaleString()} tokens
              </div>
            </div>

            {/* Estimation Methods */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2" />
                Estimation Methods
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Character-based</span>
                  <span className="text-white font-medium">{stats.tokensCharBased}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Word-based</span>
                  <span className="text-white font-medium">{stats.tokensWordBased}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Advanced</span>
                  <span className="text-blue-400 font-semibold">{stats.tokensAdvanced}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300">
                  Advanced estimation considers punctuation and formatting for better accuracy
                </p>
              </div>
            </div>

            {/* Optimization Tips */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-green-400" />
                Optimization Tips
              </h3>
              
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Remove unnecessary filler words and redundant phrases</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use simpler words instead of complex alternatives</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Convert passive voice to active voice</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Remove excessive whitespace and punctuation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            Token estimates are approximations. Actual token counts may vary depending on the specific tokenizer used by each AI model.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;