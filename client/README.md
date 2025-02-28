# package.json

ensure in the "options" section that it looks as follows for the prod env

```
"options": {
  "allowedHosts": ["localhost", ".localhost", "flask_server"],
  "proxy": "https://flask_server:5000/"
}
  ```