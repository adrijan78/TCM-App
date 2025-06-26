import { Member } from "./Member";



export class MembersParams{
    belt:string;
    ageCategory:number;
    pageNumber=1;
    pageSize=5;

    
    constructor(currentBelt:string,selectedAgeCategory:number) {
       this.belt=currentBelt;
       this.ageCategory=selectedAgeCategory;
    }
}