import Router from 'express';
import {getAllTickets,getTicketById , cancelTicket , buyTicket, updateStatus} from '../controllers/ticket.controller.js'
import { verifyJWT as verifyOrganizer} from '../middlewares/organizerAuth.middleware.js';
import { verifyJWT as verifyUser} from '../middlewares/userAuth.middleware.js';

const router = Router();

router.post("/buy-ticket", verifyUser , buyTicket);
router.post("/cancel-ticket", verifyUser , cancelTicket);
router.post("/verify-ticket", verifyUser ,updateStatus);

router.get("/get-ticket", verifyUser , getTicketById );
router.get("/get-all-tickets", verifyOrganizer , getAllTickets);

export default router;