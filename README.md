I. Font-end:
- Install: npm i
- Run command: npm run dev
II. Back-end:
- Rerequisites
  1. **Java Development Kit (JDK)**: Version 17 or higher.
  You can download it from [Adoptium](https://adoptium.net/), [Oracle](https://www.oracle.com/java/technologies/javase-downloads.html), or your package manager.
  2. **Maven**: Ensure you have Maven installed for dependency management and building the project.
- Run command for a Spring Boot application in IntelliJ:
  1. Set up the Database
  2. Modify the database configuration in `src/main/resources/application.yml` or `application.propertie`
  3. Install Dependencies : mvn clean install
  4. Run the Application: 
  + Use the green Run ▶️ button on the main() method
  + Or open the Terminal and run: ./gradlew bootRun (for Gradle)
III. Python:
- Install all required Python libraries listed in the requirements.txt file using the following command:
pip install -r requirements.txt
- Open the command prompt (CMD) and run the following command to start the FastAPI server with auto-reload enabled:
uvicorn app.main:app --reload
