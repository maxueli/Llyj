export class SelectOption {
    constructor(
        public text?: string,
        public value?: string,
        public selected?: boolean
    ) {
    }
}
export class SelectOptionGroup {
    public label: string;
    public options: Array<SelectOption>;
    constructor(label: string, options: Array<SelectOption>) {
        this.label = label;
        this.options = options;
    }
}
export class brandInfo {
    public carBrands: Array<carBrand> = [];
}
export class carBrand {
    public carBrandId: number;          // 品牌Id
    public carBrandName: string;        // 品牌名称
    public faults: Array<carSkill> = [];    // 技能

}
export class carSkill {
    public text: string;
    public value: string;
}