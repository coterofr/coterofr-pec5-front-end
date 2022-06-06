import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger
} from '@angular/animations';

export const cardsAnimation = trigger('cardsAnimation', [
  transition(
    '* => *',
    query(
      ':enter',
      [
        style({ opacity: 0.05 }),
        stagger(250, [animate('1s', style({ opacity: 1 }))]),
      ],
      { optional: true }
    )
  ),
]);
