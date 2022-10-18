// Namespace Alien Configuration Values
export const ALIENRPG = {};

/**
 * The set of ability scores used with the system
 * @type {Object}
 */
ALIENRPG.attributes = {
  str: 'ALIENRPG.AbilityStr',
  wit: 'ALIENRPG.AbilityWit',
  agl: 'ALIENRPG.AbilityAgl',
  emp: 'ALIENRPG.AbilityEmp',
};
ALIENRPG.skills = {
  heavyMach: 'ALIENRPG.SkillHeavyMach',
  closeCbt: 'ALIENRPG.SkillCloseCbt',
  stamina: 'ALIENRPG.SkillStamina',
  rangedCbt: 'ALIENRPG.SkillRangedCbt',
  mobility: 'ALIENRPG.SkillMobility',
  piloting: 'ALIENRPG.SkillPiloting',
  command: 'ALIENRPG.SkillCommand',
  manipulation: 'ALIENRPG.SkillManipulation',
  medicalAid: 'ALIENRPG.SkillMedicalAid',
  observation: 'ALIENRPG.SkillObservation',
  survival: 'ALIENRPG.SkillSurvival',
  comtech: 'ALIENRPG.SkillComtech',
};
ALIENRPG.general = {
  career: 'ALIENRPG.Career',
  appearance: 'ALIENRPG.Apparance',
  sigItem: 'ALIENRPG.SignatureItem',
};
ALIENRPG.physicalItems = [];
// ALIENRPG.physicalItems = ['item', 'weapon', 'armor', 'talent', 'planet-system', 'agenda', 'specialty', 'critical-injury'];

ALIENRPG.conditionEffects = [
  {
    id: 'starving',
    label: 'ALIENRPG.Starving',
    icon: 'systems/alienrpg/images/starving.webp',
  },
  {
    id: 'dehydrated',
    label: 'ALIENRPG.Dehydrated',
    icon: 'systems/alienrpg/images/water-flask.webp',
  },
  {
    id: 'exhausted',
    label: 'ALIENRPG.Exhausted',
    icon: 'systems/alienrpg/images/exhausted.webp',
  },
  {
    id: 'freezing',
    label: 'ALIENRPG.Freezing',
    icon: 'systems/alienrpg/images/frozen.webp',
  },
  {
    id: 'encumbered',
    label: 'ALIENRPG.Encumbered',
    icon: 'systems/alienrpg/images/weight.webp',
  },
  {
    id: 'panicked',
    label: 'ALIENRPG.Panicked',
    icon: 'icons/svg/terror.svg',
  },
  {
    id: 'overwatch',
    label: 'ALIENRPG.Overwatch',
    icon: 'systems/alienrpg/images/eye-target.webp',
  },
  {
    id: 'radiation',
    label: 'ALIENRPG.Radiation',
    icon: 'icons/svg/radiation.svg',
  },
];

ALIENRPG.vehicle = {
  crewPositionFlags: ['COMMANDER', 'PILOT', 'GUNNER', 'PASSENGER'],
  crewPositionFlagsLocalized: {
    COMMANDER: 'ALIENRPG.CrewCommander',
    PILOT: 'ALIENRPG.CrewPilot',
    GUNNER: 'ALIENRPG.CrewGunner',
    PASSENGER: 'ALIENRPG.CrewPasanger',
  },
};

ALIENRPG.Icons = {
  buttons: {
    edit: '<i class="fas fa-edit"></i>',
    delete: '<i class="fas fa-trash"></i>',
    remove: '<i class="fas fa-times"></i>',
  },
};
