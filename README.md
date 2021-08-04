# Bloglist

This app has been coded by myself in accordance with the requirements demanded by the course 'Full Stack open 2021' by University of Helsinki. The project is simply a vessel to familiarize oneself with the broader world of modern web development, and hence is particularly lacking in completeness. This is simply a limitation of the scope of this project.

Bloglist is a blogging app where users can write blogs, and read blogs posted by other users.

Users can login and create/delete their blogs. There's a backend responsible for talking to a MongoDB database regarding user and blog details. It features authentication using jsonwebtoken. Password hashes are stored in the database among other things. The frontend includes some styling using SemanticUI. It uses Redux for general state management along with hooks for more local state management. It also includes various testing apparatus (cypress, react-testing-library, jest). The app can be deployed via Heroku as well.

### Demonstation of a Blog
![blog-demo](https://github.com/nishnat-rishi/finnish-web-thingy/blob/bloglist/demo-gifs/blog-demo.gif?raw=true "Blog Demo")