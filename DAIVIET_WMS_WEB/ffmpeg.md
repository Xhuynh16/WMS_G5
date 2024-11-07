ffmpeg -v verbose -i <ipcamera> -vf scale=1920:1080 -vcodec libx264 -r 25 -b:v 1000000 -crf 31 -acodec aac -sc_threshold 0 -f hls -hls_time 5 -segment_time 5 -hls_list_size 5 <path/file-name>
