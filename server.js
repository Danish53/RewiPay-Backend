import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import ordersRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productsRoutes from "./routes/productRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import path from 'path';
import methodOverride from 'method-override';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import expressLayouts from "express-ejs-layouts";
import session from 'express-session';
import MongoStore from 'connect-mongo';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret123', // strong secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use("/api/user", userRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/admin", adminRoutes);


app.get('/', (req, res) => res.redirect('/admin/login'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running on port 5000");
});

