# LiteCMMS API Documentation (EN)

## Main Endpoints

- `GET /api/status` – API status
- `GET /api/system-status` – System and database status
- `GET /api/machines` – List all machines
- `GET /api/machines/:id` – Machine details
- `POST /api/machines` – Add a machine
- `PUT /api/machines/:id` – Edit a machine
- `DELETE /api/machines/:id` – Delete a machine

- `GET /api/maintenance-tasks` – List maintenance tasks
- `POST /api/maintenance-tasks` – Add a task
- `PUT /api/maintenance-tasks/:id` – Edit a task
- `DELETE /api/maintenance-tasks/:id` – Delete a task

- `GET /api/alerts` – List alerts
- `PUT /api/alerts/:id/resolve` – Mark alert as resolved

- `POST /api/auth/login` – Login
- `POST /api/auth/register` – Register
- `POST /api/auth/logout` – Logout

## Example Response
```json
{
  "status": "ok",
  "data": [ ... ],
  "message": "Success"
}
```

## Authentication
- JWT in `Authorization: Bearer <token>` header
- `token` cookie for session

## Error Codes
- 401 Unauthorized – Not authenticated
- 404 Not Found – Resource not found
- 500 Internal Server Error – Server error

## Contact
For questions: admin@litecmms.com 