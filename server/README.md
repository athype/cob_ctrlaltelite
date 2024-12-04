### Audio storing
#### Tables
Our database is a SQlite table with 4 columns: id, file_path, duration, created_at. Out of the 4,
2 are auto created and only file_path and duration is needed to be created when you upload an 
audio file

- The file_path is basically the route to the audio file physically being stored on our system. 
This is our limitation because table-type database are not that good with storing big binary items

- Duration: length of the audio file

- ID: auto generated

- created_at: the creation time of the audio file

#### Audio file
These can be found at the uploads directory and the table is in the db directory. The code auto 
create both of these on start up if they don't exist yet. 
You can probably view the sqlite table if you install the correct plugin. I don't know the one 
for IntelliJ but for VS code is SQLite Viewer

#### Multer 

A dependency uses for managing uploading file from the system.

- File management: Multer allows us to choose where to store our file. In this case, we store it 
  in the uploads directory. It also helps with naming conventions to make sure all of our file 
  names are different (we should probably change the file names tho)
- Access to uploaded files: Use req.files or req.file
- Flexibility in file handling: Currently we store the files as diskStorage so practically, the 
  audios are stored in the project file. This could be change to memory using Multer but we can 
  discuss this later.


## Please add README file to everything you do to explain what you added
