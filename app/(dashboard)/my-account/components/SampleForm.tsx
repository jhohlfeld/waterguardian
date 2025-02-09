'use client'

export function SampleForm() {
  return (
    <form className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-11"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="mt-1 block w-full rounded-md border-gray-4 focus:border-accent-6 focus:ring-accent-6 text-lg py-3 px-4"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-11"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full rounded-md border-gray-4 focus:border-accent-6 focus:ring-accent-6 text-lg py-3 px-4"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-11"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-4 focus:border-accent-6 focus:ring-accent-6 text-lg py-3 px-4"
          placeholder="Your message"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-accent-9 text-white py-2 px-4 rounded-xl hover:bg-accent-10 focus:outline-none focus:ring-2 focus:ring-accent-5 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  )
}
