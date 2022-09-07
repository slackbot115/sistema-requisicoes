import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Funcionario } from 'src/app/funcionarios/models/funcionario.model';
import { Equipamento } from 'src/app/equipamentos/models/equipamento.model';

export class Requisicao {
  id: string;
  dataAbertura: any;
  descricao: string;
  funcionarioId: string;
  funcionario?: Funcionario;
  departamentoId: string;
  departamento?: Departamento;
  equipamentoId: string;
  equipamento?: Equipamento;
}
