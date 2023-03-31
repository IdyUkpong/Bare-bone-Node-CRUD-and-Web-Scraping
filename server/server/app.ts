import http, { IncomingMessage, Server, ServerResponse } from "http";
import fs from "fs";
/*
implement your server code here
*/
interface MyDatabase {
  organization: string;
  createdAt: string;
  updatedAt: string;
  products: string[];
  marketValue: string;
  address: string;
  ceo: string;
  country: string;
  id: number;
  noOfEmployees: number;
  employees: string[];
}

const dataBase: MyDatabase = {
  organization: "",
  createdAt: "",
  updatedAt: "",
  products: [],
  marketValue: "",
  address: "",
  ceo: "",
  country: "",
  id: 0,
  noOfEmployees: 0,
  employees: [],
};

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const dataBasePath = "./server/data/database.json";
    let users: any[] = [];
    if (fs.existsSync(dataBasePath)) {
      const data = fs.readFileSync(dataBasePath, "utf8");
      users = JSON.parse(data);
    } else {
      fs.writeFileSync(dataBasePath, JSON.stringify(users, null, '\n'));
    }

    if (req.method === "GET") {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } else if (req.method === "POST") {
      req.on('data', (data) => {
        
        const dataBaseObj = { ...dataBase };
        const newData = JSON.parse(data)
        dataBaseObj["organization"] = newData.organization;
        dataBaseObj["createdAt"] = `${new Date().toISOString()}`;
        dataBaseObj["products"] = newData.products;
        dataBaseObj["marketValue"] = newData.marketValue;
        dataBaseObj["address"] = newData.address;
        dataBaseObj["ceo"] = newData.ceo;
        dataBaseObj["country"] = newData.country;
        dataBaseObj["id"] = users.length + 1;
        dataBaseObj["employees"] = newData.employees;
        dataBaseObj["noOfEmployees"] = newData.employees.length
        users.push(dataBaseObj);
        fs.writeFile(dataBasePath, JSON.stringify(users), (err) => {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end("An error occured while saving data to database");
          } else {
            res.statusCode = 201;
            res.end(JSON.stringify(dataBaseObj));
          }
        });
      }).on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Data saved successfully')
  
      })
      
      
    } else if (req.method === "PUT") {
      let myUrl: any = req.url;
      const userId = Number(myUrl.slice(1));
      let userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        res.statusCode = 404;
        res.end(`User with ID: ${userId} not found`);
        return;
      }
      let currentUser = users[userIndex];
      req.on('data', (data) => {
        const currentUserData = JSON.parse(data)
         currentUser["updatedAt"] = `${new Date().toISOString()}`;
         currentUser["country"] = currentUserData.country;
         currentUser["marketValue"] = currentUserData.marketValue;
        currentUser["organization"] = currentUserData.organization;
        users[userIndex] = currentUser;
        
          fs.writeFile(dataBasePath, JSON.stringify(users), (err) => {
            if (err) {
              console.error(err);
              res.statusCode = 500;
              res.end("An error occured while updating data to database");
            } else {
              console.log("Database updated successfully");
            }
          });
          res.end(JSON.stringify(currentUser));
      }).on('end', () => {
        res.end('database updated')
      })
     
    } else if (req.method === "DELETE") {
      let myUrl: any = req.url;
      const userId = Number(myUrl.slice(1));
      let userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        res.statusCode = 404;
        res.end(`User with ID: ${userId} not found`);
        return;
      } else {
        users.splice(userIndex, 1);
        fs.writeFile(dataBasePath, JSON.stringify(users), (err) => {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            res.end("An error occured while deleting user from database");
            return;
          } else {
            console.log("User deleted and database updated successfully");
            res.statusCode = 200;
            res.end(JSON.stringify(users));
          }
        });
      }
    }
  }
);
server.listen(3005, "localhost", () =>
  console.log("listening for requests on port 3005")
);


