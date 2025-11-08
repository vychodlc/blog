import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        A Little Site
      </h1>
      <p className="mb-4">
        A Front-end Developer at Hangzhou from 2024 to now.
        A College Student at Beijing from 2017 to 2024.
        A Small-town Exam Grinders before 2017.
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}