interface EnrolledCoursePageProps {
  params: Promise<{ slug: string }>;
}

const EnrolledCoursePage = async ({ params }: EnrolledCoursePageProps) => {
  const { slug } = await params;
  return <div>{slug}</div>;
};

export default EnrolledCoursePage;
