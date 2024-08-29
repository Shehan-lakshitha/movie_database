
import ballerina/http;
import ballerina/uuid;
import ballerinax/mongodb;

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

    function init() returns error? {
        self.moviesDb = check mongoDb->getDatabase("movies");
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
}

isolated function getMovie(mongodb:Database moviesDb, string id) returns Movie|error {
    mongodb:Collection movies = check moviesDb->getCollection("movies");
    stream<Movie, error?> findResult = check movies->find({id});
    Movie[] result = check from Movie m in findResult
        select m;
    if result.length() != 1 {
        return error(string `Failed to find the movie with given id: ${id}`);
    }
    return result[0];
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

