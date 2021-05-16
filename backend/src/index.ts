import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import passport from "passport";
import passportLocal from "passport-local";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcryptjs";
import User from "./User";
import dotenv from "dotenv";
import { UserInterface } from "./interfaces/UserInterface";

const LocalStrategy = passportLocal.Strategy;

mongoose.connect(
  "mongodb+srv://kaikka:6gRZqh8KCfcJHrPx@cluster0.1myzm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected To Mongo");
  }
);

// Middleware
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Passport
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err: any, user: any) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  })
);

passport.serializeUser((user: any, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: any, user: any) => {
    const userInformation = {
      username: user.username,
      isAdmin: user.isAdmin,
      id: user._id,
    };
    cb(err, userInformation);
  });
});

// Routes
app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    res.send("Wrong values!");
    return;
  }
  User.findOne({ username }, async (err: Error, doc: UserInterface) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User registered successfully");
    }
  });
});

const isAdministratorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user }: any = req;
  if (user) {
    User.findOne(
      { username: user.username },
      (err: any, doc: UserInterface) => {
        if (err) throw err;
        if (doc?.isAdmin) {
          next();
        } else {
          res.send("Sorry, only admins can perform this.");
        }
      }
    );
  } else {
    res.send("Sorry, you aren't logged in.");
  }
};

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("User logged in successfully");
});

app.get("/user", (req, res) => {
  res.send(req.user);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("User logged out successfully");
});

app.post("/deleteUser", isAdministratorMiddleware, async (req, res) => {
  const { id } = req.body;
  // @ts-ignore
  await User.findByIdAndDelete(id, (err: Error) => {
    if (err) throw err;
  });
  res.send("User deleted successfully");
});

app.get("/getAllUsers", isAdministratorMiddleware, async (req, res) => {
  await User.find({}, (err: Error, data: UserInterface[]) => {
    if (err) throw err;
    const filteredUsers: any = [];
    data.forEach((item: any) => {
      const userInformation = {
        id: item._id,
        username: item.username,
        isAdmin: item.isAdmin,
      };
      filteredUsers.push(userInformation);
    });
    res.send(filteredUsers);
  });
});

app.listen(4000, () => {
  console.log("Server started");
});
