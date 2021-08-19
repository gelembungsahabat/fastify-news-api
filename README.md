# Fastify News API

API for manage topic and news with fastify-ts

## How To Use?

install dependencies:
`yarn`

create migration db:
`make run-migrate-api`

and just have fum!:
`make run-api`


if you wanna clear data in db, you can use this command:
`make run-rollback-api`


## Request API

### GET request (url)
 - topic
```
localhost:3000/topic
```
 - news
```
localhost:3000/news
```

### POST request (body)
- topic:
```
{
	"topic_name": "sport"
}
```

- news:
```
{
	"title": "github sekarang gabisa pake user password",
	"body": "karena tidak bisa pake user password, user github diharuskan pakai personal token access, kalau tidak harus pake ssh",
	"status": "draft",
	"topic_id": 1630144323
}
```

