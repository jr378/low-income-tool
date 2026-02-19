// State data for Medicaid expansion and other state-specific rules

export const STATES = [
  { code: 'AL', name: 'Alabama', medicaidExpansion: false },
  { code: 'AK', name: 'Alaska', medicaidExpansion: true },
  { code: 'AZ', name: 'Arizona', medicaidExpansion: true },
  { code: 'AR', name: 'Arkansas', medicaidExpansion: true },
  { code: 'CA', name: 'California', medicaidExpansion: true },
  { code: 'CO', name: 'Colorado', medicaidExpansion: true },
  { code: 'CT', name: 'Connecticut', medicaidExpansion: true },
  { code: 'DE', name: 'Delaware', medicaidExpansion: true },
  { code: 'DC', name: 'District of Columbia', medicaidExpansion: true },
  { code: 'FL', name: 'Florida', medicaidExpansion: false },
  { code: 'GA', name: 'Georgia', medicaidExpansion: false },
  { code: 'HI', name: 'Hawaii', medicaidExpansion: true },
  { code: 'ID', name: 'Idaho', medicaidExpansion: true },
  { code: 'IL', name: 'Illinois', medicaidExpansion: true },
  { code: 'IN', name: 'Indiana', medicaidExpansion: true },
  { code: 'IA', name: 'Iowa', medicaidExpansion: true },
  { code: 'KS', name: 'Kansas', medicaidExpansion: false },
  { code: 'KY', name: 'Kentucky', medicaidExpansion: true },
  { code: 'LA', name: 'Louisiana', medicaidExpansion: true },
  { code: 'ME', name: 'Maine', medicaidExpansion: true },
  { code: 'MD', name: 'Maryland', medicaidExpansion: true },
  { code: 'MA', name: 'Massachusetts', medicaidExpansion: true },
  { code: 'MI', name: 'Michigan', medicaidExpansion: true },
  { code: 'MN', name: 'Minnesota', medicaidExpansion: true },
  { code: 'MS', name: 'Mississippi', medicaidExpansion: false },
  { code: 'MO', name: 'Missouri', medicaidExpansion: true },
  { code: 'MT', name: 'Montana', medicaidExpansion: true },
  { code: 'NE', name: 'Nebraska', medicaidExpansion: true },
  { code: 'NV', name: 'Nevada', medicaidExpansion: true },
  { code: 'NH', name: 'New Hampshire', medicaidExpansion: true },
  { code: 'NJ', name: 'New Jersey', medicaidExpansion: true },
  { code: 'NM', name: 'New Mexico', medicaidExpansion: true },
  { code: 'NY', name: 'New York', medicaidExpansion: true },
  { code: 'NC', name: 'North Carolina', medicaidExpansion: true },
  { code: 'ND', name: 'North Dakota', medicaidExpansion: true },
  { code: 'OH', name: 'Ohio', medicaidExpansion: true },
  { code: 'OK', name: 'Oklahoma', medicaidExpansion: true },
  { code: 'OR', name: 'Oregon', medicaidExpansion: true },
  { code: 'PA', name: 'Pennsylvania', medicaidExpansion: true },
  { code: 'RI', name: 'Rhode Island', medicaidExpansion: true },
  { code: 'SC', name: 'South Carolina', medicaidExpansion: false },
  { code: 'SD', name: 'South Dakota', medicaidExpansion: true },
  { code: 'TN', name: 'Tennessee', medicaidExpansion: false },
  { code: 'TX', name: 'Texas', medicaidExpansion: false },
  { code: 'UT', name: 'Utah', medicaidExpansion: true },
  { code: 'VT', name: 'Vermont', medicaidExpansion: true },
  { code: 'VA', name: 'Virginia', medicaidExpansion: true },
  { code: 'WA', name: 'Washington', medicaidExpansion: true },
  { code: 'WV', name: 'West Virginia', medicaidExpansion: true },
  { code: 'WI', name: 'Wisconsin', medicaidExpansion: false },
  { code: 'WY', name: 'Wyoming', medicaidExpansion: false },
];

export function getStateByCode(code) {
  return STATES.find(s => s.code === code);
}

export function isMedicaidExpansionState(code) {
  const state = getStateByCode(code);
  return state ? state.medicaidExpansion : false;
}
