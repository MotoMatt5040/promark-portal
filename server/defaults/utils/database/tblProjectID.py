from sqlalchemy import Column, String, Integer, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

Base = declarative_base()

_type_lookup = {"integer": Integer, "string": String}

def json_class_mapping(jsonSchema):
    classDict = {"__tablename__": jsonSchema["tablename"]}

    classDict.update(
        {
            record["name"]: Column(
                _type_lookup[record["type"]], primary_key=record.get("is_pk", False)
            ) for record in jsonSchema["columns"]
        }
    )
    return type(jsonSchema["classname"], (Base,), classDict)


if __name__ == "__main__":
    tablename = "fish"

    while True:

        json_class_schema = {
            "classname": "TableMaker",
            "tablename": tablename,
            "columns": [
                {"name": "col1", "type": "integer", "is_pk": True},
                {"name": "col2", "type": "string"},
                {"name": "col3", "type": "integer"},
            ],
        }

        data = [
            {"col1": 1, "col2": "the first object", "col3": 12},
            {"col1": 2, "col2": "the second object", "col3": 9},
            {"col1": 3, "col2": "the third object", "col3": 15},
        ]

        tblProjectID = json_class_mapping(json_class_schema)

        conn = create_engine("sqlite://", echo=True)
        Base.metadata.create_all(conn)

        with Session(conn) as session:
            session.add_all(tblProjectID(**record) for record in data)
            session.commit()


        if input("Continue? y/n") == 'n':
            break

        tablename = input("Please enter table name")