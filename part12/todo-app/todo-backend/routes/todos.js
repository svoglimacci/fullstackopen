const express = require('express');
const { getAsync, setAsync } = require('../redis')
const { Todo } = require('../mongo')
const router = express.Router();

const todoCounter = async () => {

  const count = await getAsync("count")

  return count ? setAsync("count", parseInt(count) + 1) : setAsync("count", 1)
}

/* GET todos listing. */
router.get('/', async (_, res) => {
    const todos = await Todo.find({})
    res.send(todos);
});


/* POST todo to listing. */
router.post('/', async (req, res) => {
    const todo = await Todo.create({
      text: req.body.text,
      done: false
    })
    res.send(todo);
    const getdb = await redis.getAsync("added_todos")
    const parsedb = parseInt(getdb) ? parseInt(getdb) : 0
    await redis.setAsync("added_todos", (parsedb + 1))
  });


const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params

  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = req.todo

  if(todo){
    return res.json(todo)
  }

  res.sendStatus(405); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {

  const todo = req.body

  console.log(todo)

  const newTodo = await Todo.insertOne(todo)

  if(!newTodo)
    return res.status(401).json(newTodo)

  res.sendStatus(405); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;