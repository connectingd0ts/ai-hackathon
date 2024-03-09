from utils import extract_text_from_docx, get_mom, generate_mom , write_to_file


# Example usage
print('--------------------started------------------------')
file_path = 'Transcript_2024-03-02.docx'  # Change this to your file path
date = file_path.split('_')[-1].split('.docx')[0]
location = 'Remote'
prepared_by = 'AI'
print('--------------file opened------------------')
transcript = extract_text_from_docx(file_path)
print('--------------transcript extracted------------------')

mom_transcript = get_mom(transcript)
print('--------------summary extracted------------------')

mom = generate_mom(mom_transcript,date,location,prepared_by)
print('--------------mom generated successfully------------------')

output_file_path = 'minutes_of_meeting.txt'  # Change this to your file path
write_to_file(mom, output_file_path)
print('--------------mom generated successfully------------------')


print(mom)
