/* Paleta y medidas compartidas con el portal web */
export const C = {
  morado: '#3B1D4A', morado2: '#55306A', moradoClaro: '#EEE8F2',
  oro: '#A8822A', oroCirio: '#C9A24A', oroClaro: '#F3EBD6',
  burdeos: '#8C1D2C', burdeosClaro: '#F8E6E8',
  romero: '#2E6A4C', romeroClaro: '#E3F0E8',
  azul: '#2C4E7A', azulClaro: '#E5ECF5',
  ambar: '#8A5A00', ambarClaro: '#FBF0D9',
  papel: '#F6F5F8', blanco: '#FFFFFF',
  tinta: '#22192A', tinta2: '#5B5163', tinta3: '#8A8291',
  linea: '#E2DEE6', linea2: '#CFC9D5'
};
export const R = { s: 8, m: 12, l: 16 };
/* Tipografía serif del sistema para los títulos (en el portal: Cormorant Garamond) */
import { Platform } from 'react-native';
export const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });
