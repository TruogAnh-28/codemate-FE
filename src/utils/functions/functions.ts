export const getAvatarStudentUrl = (avatarUrl: string) => {
  return avatarUrl && avatarUrl.startsWith('http') ? avatarUrl : '../../assets/default-student-avt.jpg';
};
export const getAvatarCourseUrl = (avatarUrl: string) => {
  return avatarUrl && avatarUrl.startsWith('http') ? avatarUrl : '../../assets/default-course-avt.svg';
};
