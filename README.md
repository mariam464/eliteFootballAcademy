
# Elite Football Academy
A full-stack **football academy management system** built with **Spring Boot (Java)** for the backend and **React** for the frontend. It provides complete management of **Teams, Players, Coaches, Matches, and Tickets**.

---

## Features
**Team Management** – Create, edit, delete teams  
**Player Management** – Add players, assign to teams, update details  
**Coach Management** – Assign coaches to teams, change assignments  
**Match Management** – Schedule matches, assign home and away teams  
**Ticket Management** – Manage tickets for matches  
 RESTful API using **Spring Boot**  
**React Frontend** with modern UI  
**PostgreSQL Database**
Image upload support  

---

## Tech Stack
**Backend:**  
- Java 24  
- Spring Boot (Web, Data JPA)  
- PostgreSQL  
- Lombok  
- Jackson

**Frontend:**  
- React (Vite)  
- Axios for API calls  
- React Router DOM  
- Tailwind CSS  

---


## API Endpoints(examples)
### Players
- `GET /players` – Get all players  
- `POST /players/add` – Add new player  
- `PATCH /players/update/{id}` – Update player  
- `DELETE /players/delete/{id}` – Delete player  

### Teams
- `GET /teams` – Get all teams  
- `POST /teams/add` – Add new team  
- `PATCH /teams/update/{id}` – Update team  

### Coaches
- `GET /coaches` – Get all coaches  
- `POST /coaches/add` – Add new coach  
- `PATCH /coaches/update/{id}` – Update coach  

### Matches
- `GET /matches` – List all matches  
- `POST /matches/add` – Schedule a match  
- `PUT /matches/upfate/{id}` – Update match details  
- `DELETE /matches/delete/{id}` – Delete match  

### Tickets
- `GET /tickets` – List all tickets  
- `POST /tickets/add` – Create ticket  
- `DELETE /tickets/delete/{id}` – Delete ticket  

---

## Setup Instructions

### Backend
1. Navigate to `backend/`  
2. Configure database in `application.properties`:
   ```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/elite_academy
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Backend runs on `http://localhost:8080`

---

### Frontend
1. Navigate to `frontend/`  
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm run dev
   ```
4. Frontend runs on `http://localhost:5173`

---

## CORS Configuration
Add this config in Spring Boot (`WebConfig.java`):
```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS");
            }
        };
    }
}
```


---

## Future Improvements
- Authentication & Authorization (Spring Security + JWT)  
- Ticket booking system with payment integration  
