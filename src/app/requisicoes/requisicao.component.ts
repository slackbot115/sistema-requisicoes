import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.css'],
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private toastrService: ToastrService,
    private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
    private equipamentoService: EquipamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(''),
      dataAbertura: new FormControl(''),
      descricao: new FormControl('', [Validators.required]),
      funcionarioId: new FormControl(''),
      funcionario: new FormControl(''),
      departamentoId: new FormControl('', [Validators.required]),
      departamento: new FormControl(''),
      equipamentoId: new FormControl(''),
      equipamento: new FormControl(''),
    });

    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
    this.requisicoes$ = this.requisicaoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? 'Atualização' : 'Cadastro';
  }

  get id(): AbstractControl | null {
    return this.form.get('id');
  }

  get dataAbertura(): AbstractControl | null {
    return this.form.get('dataAbertura');
  }

  get descricao(): AbstractControl | null {
    return this.form.get('descricao');
  }

  get funcionarioId(): AbstractControl | null {
    return this.form.get('funcionarioId');
  }

  get departamentoId(): AbstractControl | null {
    return this.form.get('departamentoId');
  }

  get equipamentoId(): AbstractControl | null {
    return this.form.get('equipamentoId');
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();

    if (requisicao) {
      const funcionario = requisicao.funcionario
        ? requisicao.funcionario
        : null;

      const departamento = requisicao.departamento
        ? requisicao.departamento
        : null;

      const equipamento = requisicao.equipamento
        ? requisicao.equipamento
        : null;

      const requisicaoCompleta = {
        ...requisicao,
        funcionario,
        departamento,
        equipamento,
      };

      this.form.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (!requisicao) {
          const auth = getAuth();
          this.funcionarioId?.setValue(auth.currentUser?.uid);
          this.dataAbertura?.setValue(new Date());

          await this.requisicaoService.inserir(this.form.value);
        } else await this.requisicaoService.editar(this.form.value);

        this.toastrService.success(
          `A requisição foi salvo com sucesso!`,
          'Cadastro de Requisições'
        );
      }
    } catch (error) {
      if (error != 'fechar' && error != '0' && error != '1')
        this.toastrService.error(
          'Houve um erro ao salvar a requisição. Tente novamente.',
          'Cadastro de Requisições'
        );
    }
  }

  public async excluir(requisicao: Requisicao) {
    try {
      await this.requisicaoService.excluir(requisicao);

      this.toastrService.success(
        `A requisição foi excluído com sucesso!`,
        'Cadastro de Funcionário'
      );
    } catch (error) {
      this.toastrService.error(
        'Houve um erro ao excluir a requisição. Tente novamente.',
        'Cadastro de Funcionário'
      );
    }
  }
}
