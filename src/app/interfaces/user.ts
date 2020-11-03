export interface User {
    email?:string;
    password?:string;
    name?:string;
    sobrenome?:string;
    telefone?:number;
    cpf?: number;
    passConfirm?: string,
    idade?:number;

    rua?:string;
    numero?:string;
    complemento?: string;
    cidade?:string;
    bairro?:string;
    
    userId?: string;
   
}
