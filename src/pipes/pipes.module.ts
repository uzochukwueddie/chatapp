import { NgModule } from '@angular/core';
import { RemoveDuplicatesPipe } from './remove-duplicates/remove-duplicates';
@NgModule({
	declarations: [RemoveDuplicatesPipe],
	imports: [],
	exports: [RemoveDuplicatesPipe]
})
export class PipesModule {}
