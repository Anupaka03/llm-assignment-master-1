## Beginnning
Started the project by reading the provided README.md file, setting up the environment with the required packages and understanding the provided code in both the frontend and backend directories.

## Model
### LLM Model
Decided to proceed with pretrained BERT model from Hugging Face as I had prior experience in it and also because BERT specialised in Question Answering task which was exaclty what this project had to do. But after implementing it, I realised it was not able to perform on large inputs and our project enabled users to upload files of size less than 100MB. Hence decided to use another LLM model. Came across open source LLM - Llama 2 that had advanced NLP capabalitites enabling us to use large inputs thus allowing users to upload files.

### Llama 2
With the help of some of the existing projects of Llama2, I understood how to use the LLM model for the project. Before deciding to integrate with the frontend and writing it in the main.py file, I created another test python file for making sure that the model was taking the input of a local file and a question properly, processing it and giving the desired ouput. During this phase there were errors I encountered but the main problem was regarding the versions. The existing projects that used Llama 2 model had used some packages that had been shifted inside other packages in the recent version. So I had to look into the documentation of Llama to check the location of the required packages and how to install them. Another problem was, while I installed the packages required for the LLM model there was some kind of conflicting dependency issue with pydantic==2.6.3 and the other packages. So I had to change the version of the pydantic package which is reflected in the requirements.txt file.

## Backend
After successfully getting the desired output for the test python file. I decided to integrate it into the backend - main.py program. The SimpleDirectoryReader class of Llama could handle different types of files. It read the different file types as text, but it could only read from local files/directory. So I had to save the file uploaded in the frontend locally and delete it after the entire proceess was done.

## Frontend
Since I did not have much idea in the frontend side, I took help of Chat GPT to integrate few functionality like displaying pop up after file has been uploaded, displaying message when user tries to submit large files or unsupported file types and also to implement some basic styling using bootstrap.I also changed the tag details to include different file types.

## Testing
For testing the project I downloaded a research paper on Attention which was in pdf format and I also used some of the previous text datasets that I had which I got from one of the courses I had completed. For a large file of size greater than 100MB I downloaded one from the Internet. I used these files for testing the application.

## My Experience
There were a lot of new things that I encountered while doing this project. It was a thrilling experience and a wonderful oppurtunity that I got to work on this project.

