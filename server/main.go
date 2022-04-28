package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type TODO struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Done        bool   `json:"done"`
	Description string `json:"description"`
}

func main() {
	app := fiber.New()

	todos := []TODO{}

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": 200, "message": "health checked"})
	})

	app.Post("/api/todo", func(c *fiber.Ctx) error {
		todo := &TODO{}

		if err := c.BodyParser(todo); err != nil {
			return c.JSON(err)
		}

		todo.ID = len(todos) + 1

		todos = append(todos, *todo)

		return c.JSON(fiber.Map{"status": 200, "todos": todos})
	})

	app.Patch("/api/todo/done/:id", func(c *fiber.Ctx) error {

		id, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(401).SendString("Invalid ID")
		}

		for index, value := range todos {
			if value.ID == id {
				if todos[index].Done {
					todos[index].Done = false
				} else {
					todos[index].Done = true
				}
				break
			}
		}

		return c.JSON(fiber.Map{"status": 200, "todos": todos})
	})

	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(todos)
	})

	app.Delete("/api/todo/:id", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(401).SendString("Invalid ID")
		}

		for index, value := range todos {
			if value.ID == id {
				todos = append(todos[:index], todos[index+1:]...)
				break
			}
		}

		return c.Status(200).JSON(todos)
	})

	log.Fatal(app.Listen(":4000"))

}
