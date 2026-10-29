#include <iostream>
#include <vector>
using namespace std;

void printBoard(const vector<char>& board) {
    cout << "\n";

    for (int i = 0; i < 9; i++) {
        cout << " " << board[i] << " ";

        if (i % 3 != 2) {
            cout << "|";
        }

        if (i % 3 == 2 && i != 8) {
            cout << "\n---+---+---\n";
        }
    }

    cout << "\n\n";
}

bool checkWinner(const vector<char>& board, char player) {
    int winningPatterns[8][3] = {
        {0, 1, 2},
        {3, 4, 5},
        {6, 7, 8},

        {0, 3, 6},
        {1, 4, 7},
        {2, 5, 8},

        {0, 4, 8},
        {2, 4, 6}
    };

    for (auto &pattern : winningPatterns) {
        if (
            board[pattern[0]] == player &&
            board[pattern[1]] == player &&
            board[pattern[2]] == player
        ) {
            return true;
        }
    }

    return false;
}

bool isDraw(const vector<char>& board) {
    for (char cell : board) {
        if (cell != 'X' && cell != 'O') {
            return false;
        }
    }

    return true;
}

int main() {
    vector<char> board = {
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9'
    };

    char currentPlayer = 'X';

    cout << "============================\n";
    cout << "      TIC TAC TOE\n";
    cout << "============================\n";

    cout << "\nPlayer 1: X";
    cout << "\nPlayer 2: O\n";

    while (true) {
        printBoard(board);

        int position;

        cout << "Player "
             << currentPlayer
             << ", choose position (1-9): ";

        cin >> position;

        // Invalid range
        if (position < 1 || position > 9) {
            cout << "\nInvalid position!\n";
            continue;
        }

        int index = position - 1;

        // Cell already occupied
        if (
            board[index] == 'X' ||
            board[index] == 'O'
        ) {
            cout << "\nPosition already occupied!\n";
            continue;
        }

        board[index] = currentPlayer;

        // Check winner
        if (checkWinner(board, currentPlayer)) {
            printBoard(board);

            cout << "Player "
                 << currentPlayer
                 << " wins! 🎉\n";

            break;
        }

        // Check draw
        if (isDraw(board)) {
            printBoard(board);

            cout << "Match Draw!\n";

            break;
        }

        // Change player
        currentPlayer =
            (currentPlayer == 'X')
                ? 'O'
                : 'X';
    }

    return 0;
}