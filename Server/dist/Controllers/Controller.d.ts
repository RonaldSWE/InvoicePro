import { type Request, type Response } from "express";
export declare function getInvoices(req: Request, res: Response): Promise<void>;
export declare function getSingleInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createInvoice(req: Request, res: Response): Promise<void>;
export declare function updateInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteInvoice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=Controller.d.ts.map