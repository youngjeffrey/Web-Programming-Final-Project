from flask import Flask, request, render_template
app = Flask(__name__)

@app.route('/send', methods=['GET','POST'])
def send():
    if request.method == 'POST':
        age = request.form['age']
        return render_template('AA.html', age=age)

    return render_template('index.html')

if __name__ == "__main__":
    app.run()
