import pyqrcode
import png
import sys
import os

def generate_qr(url, output_path):
    qr = pyqrcode.create(url)
    qr.png(output_path, scale=8)
    print(f"QR Code generated at: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python show_qr.py <url> <output_path>")
        sys.exit(1)
    
    url = sys.argv[1]
    output_path = sys.argv[2]
    generate_qr(url, output_path)
