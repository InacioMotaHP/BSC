export interface Product {
    idEmpresa?: string;
    name?: string;
    description?: string;
    picture?: string;
    price?: number;
    categoria?:string;
    createdAt?: number;
    userId?: string; //pega id do usuario 
    fornecedor?:string;
    idProduct?:string; //pega id do da lista de produtos e add quando copiar em favoritos
    id?:string;
    quant?:number;
    disponivel?:boolean;
    unidade?:string;
}
