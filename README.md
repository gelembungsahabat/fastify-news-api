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


## API Request
You can request API with `topic` and `news` endpoint

### GET request (url)
 - topic

Get all `topic` from database
```
localhost:3000/topic
```
 - news
 
 Get all `news` from database
```
localhost:3000/news
```
you can filter that `news` with adding `topic` or `status` querystring, like this :

```
http://localhost:3000/news?topic={YOUR_TOPIC}

or 

http://localhost:3000/news?status={YOUR_STATUS} 
```

you also can filter that `news` and `topic` by ID, like this :

```
http://localhost:3000/topic/{YOUR_TOPIC_ID}

or 

http://localhost:3000/news/{YOUR_NEWS_ID}
```
note: status just can be filled by `draft`, `publish`, or `deleted`
<br/>
<br/>

### POST request (JSON body)
- topic:
```
{
	"topic_name": "sport"
}
```

- news:
```
{
	"`title`": "github sekarang gabisa pake user password",
	"body": "karena tidak bisa pake user password, user github diharuskan pakai personal token access, kalau tidak harus pake ssh",
	"status": "draft",
	"topic_id": [1630144323]
}
```
note: 
- status just can be filled by `draft`, `publish`, or `deleted`
- topic_id must be Array
- you must input `topic_id` correctly, from GET request on /topic endpoint  
<br/>
<br/>

### PUT request 
(URL)
- topic:
```
http://localhost:3000/topic/{YOUR_TOPIC_ID}
```

- news:
```
http://localhost:3000/news/{YOUR_NEWS_ID}
```


(JSON body)
- topic:
```
{
	"topic_name": "tech"
}
```

- news:
```
{
	"title": "gitlab sekarang gabisa pake user password",
	"body": "karena tidak bisa pake user password, user github diharuskan pakai personal token access, kalau tidak harus pake ssh",
	"status": "draft",
	"topic_id": [1630144323, 1630144321]
}
```
note: 
- `status` just can be filled by `draft`, `publish`, or `deleted`
- `topic_id` must be Array
- you must input `topic_id` correctly, from GET request on /topic endpoint 
- `title` must be unique, not the same as before
<br/>
<br/>

### DELETE request 
- topic:
```
http://localhost:3000/topic/{YOUR_TOPIC_ID}
```

- news:
```
http://localhost:3000/news/{YOUR_NEWS_ID}
```
note:
- `topic` endpoint will be hard delete (delete topic data from Database)
- `news` endpoint will be soft delete (just update that news status from `draft` or `publish` to `deleted`)