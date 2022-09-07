import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequisicaoComponent } from './requisicao.component';
import { RequisicaoRoutingModule } from './requisicao-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [RequisicaoComponent],
  imports: [
    CommonModule,
    RequisicaoRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
})
export class RequisicaoModule {}
