import { Route } from '@angular/router';
import { harvestPath } from '@chore/routes/paths/harvest.path';
import { sharePath } from '@chore/routes/paths/share.path';

export function configureRoutes(): Route[] {
  return [
    {
      path: '',
      children: [harvestPath, sharePath],
    },
  ];
}
