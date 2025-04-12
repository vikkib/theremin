import http.server
import socketserver
import webbrowser
import os
import time
from threading import Thread

PORT = 8000

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def start_server():
    with socketserver.TCPServer(("", PORT), MyHttpRequestHandler) as httpd:
        print(f"Server started at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Server stopped.")

if __name__ == "__main__":
    # Start the server in a separate thread
    server_thread = Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()
    
    # Wait a moment for the server to start
    time.sleep(1)
    
    # Open the browser
    print(f"Opening theremin in browser: http://localhost:{PORT}/index.html")
    webbrowser.open(f"http://localhost:{PORT}/index.html")
    
    # Keep the main thread running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting...")