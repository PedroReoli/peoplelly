import EventCreationForm from "@/components/forms/EventCreationForm"

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className=" max-w-5xl flex-start gap-3 justify-start w-full">
        <img src="/assets/icons/add-post.svg" width={36} height={36} alt="add"/>
        <h2 className="h3-bold md:h2-bold text-left w-full"> Create Event</h2>
        </div>
          <EventCreationForm action="Create" onCancel={function (): void {
          throw new Error("Function not implemented.")
        } }/>
      </div>
    </div>
  )
}

export default CreatePost
