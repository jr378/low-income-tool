// Federal benefit program definitions and eligibility rules
// Each program has metadata + an eligibility function that takes user answers

export const PROGRAMS = [
  {
    id: 'snap',
    name: 'SNAP (Food Stamps)',
    nameEs: 'SNAP (Cupones de Alimentos)',
    category: 'food',
    description: 'Monthly funds loaded onto an EBT card for buying groceries. Most households receive $200-$800+/month depending on size.',
    descriptionEs: 'Fondos mensuales cargados en una tarjeta EBT para comprar alimentos. La mayoría de los hogares reciben $200-$800+/mes según el tamaño.',
    estimateBenefit: (householdSize) => {
      // Max allotments for FY2025 (approximate)
      const maxBenefits = { 1: 292, 2: 536, 3: 768, 4: 975, 5: 1158, 6: 1390, 7: 1536, 8: 1756 };
      const size = Math.min(householdSize, 8);
      return `Up to $${maxBenefits[size]}/month`;
    },
    estimateBenefitEs: (householdSize) => {
      const maxBenefits = { 1: 292, 2: 536, 3: 768, 4: 975, 5: 1158, 6: 1390, 7: 1536, 8: 1756 };
      const size = Math.min(householdSize, 8);
      return `Hasta $${maxBenefits[size]}/mes`;
    },
    applyUrl: 'https://www.fns.usda.gov/snap/state-directory',
    fplThreshold: 130, // Gross income <= 130% FPL
  },
  {
    id: 'medicaid',
    name: 'Medicaid',
    nameEs: 'Medicaid',
    category: 'health',
    description: 'Free or low-cost health coverage including doctor visits, hospital stays, prescriptions, mental health, and more.',
    descriptionEs: 'Cobertura de salud gratuita o de bajo costo que incluye visitas al médico, hospitalizaciones, recetas, salud mental y más.',
    estimateBenefit: () => 'Free or low-cost health insurance',
    estimateBenefitEs: () => 'Seguro médico gratuito o de bajo costo',
    applyUrl: 'https://www.healthcare.gov/medicaid-chip/',
    fplThreshold: 138, // Expansion states; non-expansion varies
  },
  {
    id: 'chip',
    name: 'CHIP (Children\'s Health Insurance)',
    nameEs: 'CHIP (Seguro Médico para Niños)',
    category: 'health',
    description: 'Free or low-cost health coverage for children under 19 in families that earn too much for Medicaid but can\'t afford private insurance.',
    descriptionEs: 'Cobertura de salud gratuita o de bajo costo para niños menores de 19 años en familias que ganan demasiado para Medicaid pero no pueden pagar un seguro privado.',
    estimateBenefit: () => 'Free or low-cost health insurance for children',
    estimateBenefitEs: () => 'Seguro médico gratuito o de bajo costo para niños',
    applyUrl: 'https://www.healthcare.gov/medicaid-chip/',
    fplThreshold: 200, // Varies by state, 200% is a conservative estimate
  },
  {
    id: 'wic',
    name: 'WIC (Women, Infants, and Children)',
    nameEs: 'WIC (Mujeres, Bebés y Niños)',
    category: 'food',
    description: 'Provides nutritious foods, nutrition education, and healthcare referrals for pregnant and postpartum women, infants, and children under 5.',
    descriptionEs: 'Proporciona alimentos nutritivos, educación nutricional y referencias de atención médica para mujeres embarazadas y posparto, bebés y niños menores de 5 años.',
    estimateBenefit: () => '$50-$75/month in food benefits per person',
    estimateBenefitEs: () => '$50-$75/mes en beneficios alimentarios por persona',
    applyUrl: 'https://www.fns.usda.gov/wic/wic-how-apply',
    fplThreshold: 185,
  },
  {
    id: 'liheap',
    name: 'LIHEAP (Heating & Cooling Assistance)',
    nameEs: 'LIHEAP (Asistencia para Calefacción y Refrigeración)',
    category: 'utilities',
    description: 'Helps pay heating and cooling bills. Can also help with energy-related home repairs and weatherization. Typical benefit is $200-$1,000/year.',
    descriptionEs: 'Ayuda a pagar facturas de calefacción y refrigeración. También puede ayudar con reparaciones y aislamiento del hogar. El beneficio típico es $200-$1,000/año.',
    estimateBenefit: () => '$200-$1,000/year',
    estimateBenefitEs: () => '$200-$1,000/año',
    applyUrl: 'https://www.acf.hhs.gov/ocs/liheap-state-and-territory-contact-listing',
    fplThreshold: 150,
  },
  {
    id: 'ssi',
    name: 'SSI (Supplemental Security Income)',
    nameEs: 'SSI (Seguridad de Ingreso Suplementario)',
    category: 'cash',
    description: 'Monthly cash payments for people who are 65+, blind, or have a disability and have very limited income and resources.',
    descriptionEs: 'Pagos mensuales en efectivo para personas mayores de 65 años, ciegas o con discapacidad y con ingresos y recursos muy limitados.',
    estimateBenefit: () => 'Up to $967/month (individual) or $1,450/month (couple)',
    estimateBenefitEs: () => 'Hasta $967/mes (individual) o $1,450/mes (pareja)',
    applyUrl: 'https://www.ssa.gov/ssi/',
    fplThreshold: null, // SSI has its own income rules
  },
  {
    id: 'tanf',
    name: 'TANF (Temporary Cash Assistance)',
    nameEs: 'TANF (Asistencia Temporal en Efectivo)',
    category: 'cash',
    description: 'Temporary cash assistance for families with children. Amounts and rules vary by state. Often includes job training and support services.',
    descriptionEs: 'Asistencia temporal en efectivo para familias con niños. Los montos y reglas varían según el estado. A menudo incluye capacitación laboral y servicios de apoyo.',
    estimateBenefit: () => 'Varies by state — typically $200-$700/month for a family',
    estimateBenefitEs: () => 'Varía según el estado — típicamente $200-$700/mes para una familia',
    applyUrl: 'https://www.acf.hhs.gov/ofa/map/about/help-families',
    fplThreshold: 100,
  },
  {
    id: 'lifeline',
    name: 'Lifeline (Phone/Internet Discount)',
    nameEs: 'Lifeline (Descuento en Teléfono/Internet)',
    category: 'utilities',
    description: 'Provides a $9.25/month discount on phone or internet service. Available to households on qualifying assistance programs or with income below 135% FPL.',
    descriptionEs: 'Proporciona un descuento de $9.25/mes en servicio de teléfono o internet. Disponible para hogares en programas de asistencia calificados o con ingresos por debajo del 135% del FPL.',
    estimateBenefit: () => '$9.25/month discount on phone or internet',
    estimateBenefitEs: () => '$9.25/mes de descuento en teléfono o internet',
    applyUrl: 'https://www.lifelinesupport.org/',
    fplThreshold: 135,
  },
  {
    id: 'pell',
    name: 'Pell Grant (Education)',
    nameEs: 'Beca Pell (Educación)',
    category: 'education',
    description: 'Federal grant for college students with financial need. Unlike loans, grants don\'t need to be repaid. Maximum award is $7,395/year.',
    descriptionEs: 'Beca federal para estudiantes universitarios con necesidad financiera. A diferencia de los préstamos, las becas no necesitan ser reembolsadas. La subvención máxima es $7,395/año.',
    estimateBenefit: () => 'Up to $7,395/year for college',
    estimateBenefitEs: () => 'Hasta $7,395/año para la universidad',
    applyUrl: 'https://studentaid.gov/h/apply-for-aid/fafsa',
    fplThreshold: null,
  },
];

export const CATEGORY_LABELS = {
  food: { en: 'Food Assistance', es: 'Asistencia Alimentaria' },
  health: { en: 'Healthcare', es: 'Atención Médica' },
  utilities: { en: 'Utilities & Phone', es: 'Servicios y Teléfono' },
  cash: { en: 'Cash Assistance', es: 'Asistencia en Efectivo' },
  education: { en: 'Education', es: 'Educación' },
};
