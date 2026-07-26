# -*- coding: utf-8 -*-
import urllib.request
import os
import ssl

OUTPUT_DIR = r"c:\Users\12627\Desktop\china-travelling\images"

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

def download_image(url, filepath, follow_redirects=True):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    try:
        # Use a opener that can handle redirects
        opener = urllib.request.build_opener(
            urllib.request.HTTPSHandler(context=ssl_ctx)
        )
        urllib.request.install_opener(opener)
        
        req = urllib.request.Request(url, headers=headers)
        resp = urllib.request.urlopen(req, timeout=60)
        
        # Check if we were redirected
        final_url = resp.geturl()
        print("  Final URL: %s" % final_url[:100])
        
        data = resp.read()
        with open(filepath, 'wb') as f:
            f.write(data)
        return len(data), final_url
    except Exception as e:
        print("  Error: %s" % e)
        return 0, ""

# Try Unsplash source API which redirects to random relevant photo
hk_queries = [
    "hong+kong+victoria+harbour",
    "hong+kong+skyline+night", 
    "hong+kong+kowloon",
    "victoria+harbour+sunset",
    "hong+kong+china",
]

hk_path = os.path.join(OUTPUT_DIR, "hongkong-victoria.jpg")

for query in hk_queries:
    url = "https://source.unsplash.com/1600x900/?%s" % query
    print("Trying: %s" % url)
    size, final_url = download_image(url, hk_path)
    if size > 0:
        with open(hk_path, 'rb') as f:
            header = f.read(4)
        if header[:1] == b'<':
            print("  Got HTML page, trying next query...")
            continue
        valid = header[:2] == b'\xff\xd8'
        if valid:
            print("  SUCCESS: %d bytes, valid JPEG from %s" % (size, final_url[:80]))
            break
        else:
            print("  Unknown format, trying next...")
    else:
        print("  Failed, trying next query...")
else:
    print("All source.unsplash.com queries failed!")
    
# Final check
print("\nFinal HK image check:")
sz = os.path.getsize(hk_path)
with open(hk_path, 'rb') as f:
    h = f.read(2)
print("  Size: %d bytes, Valid JPEG: %s" % (sz, h == b'\xff\xd8'))