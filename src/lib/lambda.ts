export const generateHook = async (data: {
  content: string;
  niche: string;
  platform: string;
  hookStyle?: string;
  targetAudience?: string;
  tone?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_GENERATE_HOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Hook generation failed');
  return await response.json();
};

export const generateAssembly = async (data: {
  content: string;
  platform?: string;
  contentFormat?: string;
  processingMode?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_GENERATE_ASSEMBLY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Assembly generation failed');
  return await response.json();
};

export const translateContent = async (data: {
  content: string;
  targetLanguage: string;
  culturalContext?: string;
  accessibilityLevel?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_TRANSLATE_CONTENT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Translation failed');
  return await response.json();
};

export const analyzeTrends = async (data: {
  platform: string;
  niche: string;
  region?: string;
  timeframe?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_TREND_ANALYZER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Trend analysis failed');
  return await response.json();
};

export const generateContentIdeas = async (data: {
  niche: string;
  platform: string;
  contentType?: string;
  targetAudience?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_CONTENT_IDEA_GENERATOR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Content idea generation failed');
  return await response.json();
};

export const getSchedulingIntelligence = async (data: {
  platform: string;
  contentType: string;
  niche: string;
  region: string;
  targetAudience?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_SCHEDULING_INTELLIGENCE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Scheduling intelligence failed');
  return await response.json();
};

export const generateCalendar = async (data: {
  niche: string;
  platforms: string[];
  contentGoal?: string;
  postingFrequency?: string;
  contentMix?: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_CALENDAR_GENERATOR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Calendar generation failed');
  return await response.json();
};

export const analyzeSafety = async (data: {
  content: string;
  platform: string;
  contentType: string;
}) => {
  const response = await fetch(import.meta.env.VITE_LAMBDA_SAFETY_ANALYZER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Safety analysis failed');
  return await response.json();
};
