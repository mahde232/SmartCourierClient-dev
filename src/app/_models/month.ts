import { TSMap } from "typescript-map"

export class Month
{
    private static _instance: Month;//Singelton.
    static monthMap: TSMap<string,string>;//Installed using angular-cli.
    static currentMonthInYear: string; //Null if not choosed.
    static monthMapInver: TSMap<string,string>;//Installed using angular-cli.

    private constructor()
    {
      Month.currentMonthInYear = null;
      Month.monthMap = new TSMap<string,string>();
      Month.monthMap.set('ינואר','january');
      Month.monthMap.set('פברואר','february');
      Month.monthMap.set('מרץ','march');
      Month.monthMap.set('אפריל','april');
      Month.monthMap.set('מאי','may');
      Month.monthMap.set('יוני','june');
      Month.monthMap.set('יולי','july');
      Month.monthMap.set('אוגוסט','august');
      Month.monthMap.set('ספטמבר','september');
      Month.monthMap.set('אוקטובר','october');
      Month.monthMap.set('נובמבר','november');
      Month.monthMap.set('דצמבר','december');

      Month.monthMapInver = new TSMap<string,string>();
      Month.monthMapInver.set('january','ינואר');
      Month.monthMapInver.set('february','פברואר');
      Month.monthMapInver.set('march','מרץ');
      Month.monthMapInver.set('april','אפריל');
      Month.monthMapInver.set('may','מאי');
      Month.monthMapInver.set('june','יוני');
      Month.monthMapInver.set('july','יולי');
      Month.monthMapInver.set('august','אוגוסט');
      Month.monthMapInver.set('september','ספטמבר');
      Month.monthMapInver.set('october','אוקטובר');
      Month.monthMapInver.set('november','נובמבר');
      Month.monthMapInver.set('december','דצמבר');
    }

    public static get_Instance()
    {
        return this._instance || (this._instance = new this());
    }
}
