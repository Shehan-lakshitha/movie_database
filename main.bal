
import ballerina/http;
import ballerina/uuid;
import ballerinax/mongodb;
import ballerina/crypto;

configurable string host = "localhost";
configurable int port = 27017;

configurable string URL= ?;


final mongodb:Client mongoDb = check new ({
    connection: URL
});

@http:ServiceConfig{
    cors: {
        allowOrigins: ["http://localhost:5173"],
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
        allowHeaders: ["Authorization", "Content-Type"]
    }
}

service on new http:Listener(9091) {

    private final mongodb:Database moviesDb;
    private final mongodb:Database usersDb;

    function init() returns error? {
        self.moviesDb = check mongoDb->getDatabase("movies");
        self.usersDb = check mongoDb->getDatabase("users");
    }

    resource function get movies() returns Movie[]|error {
        mongodb:Collection movies = check self.moviesDb->getCollection("movies");
        stream<Movie, error?> result = check movies->find();
        return from Movie m in result
            select m;
    }

    resource function get movies/[string id]() returns Movie|error {
        return getMovie(self.moviesDb, id);
    }

    resource function post movies(MovieInput input) returns Movie|error {
        string id = uuid:createType1AsString();
        Movie movie = {id, ...input};
        mongodb:Collection movies = check self.moviesDb->getCollection("movies");
        check movies->insertOne(movie);
        return movie;
    }

    resource function put movies/[string id](MovieUpdate update) returns Movie|error {
        mongodb:Collection movies = check self.moviesDb->getCollection("movies");
        mongodb:UpdateResult updateResult = check movies->updateOne({id}, {set: update});
        if updateResult.modifiedCount != 1 {
            return error(string `Failed to update the movie with id ${id}`);
        }
        return getMovie(self.moviesDb, id);
    }

    resource function delete movies/[string id]() returns string|error {
        mongodb:Collection movies = check self.moviesDb->getCollection("movies");
        mongodb:DeleteResult deleteResult = check movies->deleteOne({id});
        if deleteResult.deletedCount != 1 {
            return error(string `Failed to delete the movie ${id}`);
        }
        return id;
    }


    //user endpoints
    resource function post singup(UserInput input) returns User|error {
        string id = uuid:createType1AsString();
        User user = {id, ...input};

        user.password = hashPassword(user.password);
        mongodb:Collection users = check self.usersDb->getCollection("users");
        check users->insertOne(user);
        return user;
        
    }

    resource function post login(UserInput input) returns string|error {
        mongodb:Collection users = check self.usersDb->getCollection("users");
        stream<User, error?> findResult = check users->find({username: input.username});
        User[] result = check from User u in findResult
            select u;
        if result.length() != 1 {
            return error("User not found");
        }
        User user = result[0];
        if !validatePassword(input.password, user.password) {
            return error("Invalid username or password");
        }
        return result[0].id;
    }
}

isolated function getMovie(mongodb:Database moviesDb, string id) returns Movie|error {
    mongodb:Collection movies = check moviesDb->getCollection("movies");
    stream<Movie, error?> findResult = check movies->find({id});
    Movie[] result = check from Movie m in findResult
        select m;
    if result.length() != 1 {
        return error(string `Failed to find the movie with the given id: ${id}`);
    }
    return result[0];
}

isolated function hashPassword(string password) returns string {
    byte[] passwordBytes = crypto:hashSha256(password.toBytes());
    return passwordBytes.toString();
}

isolated function validatePassword(string plainpassword, string hashedPassword) returns boolean {
    string hashedInputPassword = hashPassword(plainpassword);
    return hashedInputPassword == hashedPassword;
}

public type MovieInput record {|
    string title;
    int year;
    string directorName;
|};


public type MovieUpdate record {|
    string title?;
    int year?;
    string directorName?;
|};

public type Movie record {|
    readonly string id;
    *MovieInput;
|};

public type User record {|
    readonly string id;
    string username;
    string password;
|};

public type UserInput record {|
    string username;
    string password;
|};

