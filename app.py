from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit
from user_agents import parse

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    ua_string = request.headers.get('User-Agent')
    user_agent = parse(ua_string)
    dispositivo = "mobile" if user_agent.is_mobile or user_agent.is_tablet else "desktop"
    tema = request.cookies.get('chatTheme', 'dark')
    return render_template('index.html', tema=tema, dispositivo=dispositivo)

@socketio.on('join')
def handle_join(data):
    room = data['room']
    username = data['username']
    join_room(room)
    emit('server_message', {'msg': f'{username} se ha unido a la sala.'}, to=room)

@socketio.on('leave')
def handle_leave(data):
    room = data['room']
    username = data['username']
    leave_room(room) # Lo sacamos del canal
    emit('server_message', {'msg': f'{username} ha salido de la sala.'}, to=room)

@socketio.on('send_message')
def handle_message(data):
    room = data['room']
    emit('receive_message', {
        'username': data['username'],
        'color': data.get('color', '#333333'), # Recibimos el color del usuario
        'mensaje_cifrado': data['mensaje_cifrado']
    }, to=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)