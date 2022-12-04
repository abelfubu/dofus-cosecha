import { HarvestStepModalComponent } from '../../harvest-filters/harvest-step-modal/harvest-step-modal.component';

export const HEADERS = [
  {
    label: '',
    type: 'space',
  },
  {
    label: 'Nombre',
    type: 'text',
  },
  {
    label: 'Nivel',
    type: 'text',
  },
  {
    label: 'Subzona',
    type: 'text',
  },
  {
    label: 'Zona',
    type: 'text',
  },
  {
    label: 'Etapa',
    type: 'filter',
    component: HarvestStepModalComponent,
  },
  {
    label: 'Capturado',
    type: 'text',
  },
  {
    label: 'Repetido',
    type: 'text',
  },
];
