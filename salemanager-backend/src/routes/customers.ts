// Customer Routes
import { Router } from 'express';
import { CustomerController } from '../controllers/customerController.js';

const router = Router();
const customerController = new CustomerController();

// GET /api/customers - Get all customers with pagination and search
router.get('/', customerController.getAll.bind(customerController));

// GET /api/customers/:id - Get customer by ID
router.get('/:id', customerController.getById.bind(customerController));

// POST /api/customers - Create new customer
router.post('/', customerController.create.bind(customerController));

// PUT /api/customers/:id - Update customer
router.put('/:id', customerController.update.bind(customerController));

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', customerController.delete.bind(customerController));

export default router;
