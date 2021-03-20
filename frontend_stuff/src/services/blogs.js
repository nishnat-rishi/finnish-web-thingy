import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (blogDetails) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, blogDetails, config)
  return response.data
}

const update = async (blogId, blogDetails) => {
  const response = await axios.put(`${baseUrl}/${blogId}`, {
    ...blogDetails,
    user: blogDetails.user.id,
    comments: blogDetails.comments.map(comment => comment.id)
  })
  return response.data
}

const like = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}/like`, {
    likes: blog.likes+1
  })

  return response.data
}

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${blogId}`, config)
}

const comment = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comment`, {
    content: comment
  })

  return response.data
}

const blogService = { getAll, create, like, remove, update, comment, setToken }

export default blogService